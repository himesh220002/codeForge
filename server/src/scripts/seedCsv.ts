import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { JobModel } from '../models/job.js';
import { getEmbedding } from '../services/aiService.js';
import { addJobsToChroma } from '../services/chromaService.js';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  console.log("Clearing existing MongoDB jobs to ensure a fresh sync with ChromaDB...");
  await JobModel.deleteMany({});

  const linkedinCsvPath = path.resolve(__dirname, '../../../client/public/csv files/final_data.csv');
  const naukriCsvPath = path.resolve(__dirname, '../../../client/public/csv files/marketing_sample_for_naukri_com-jobs__20190701_20190830__30k_data.csv');

  console.log("Reading LinkedIn CSV...");
  const linkedinContent = fs.readFileSync(linkedinCsvPath, 'utf8');
  const linkedinRecords = parse(linkedinContent, { columns: true, skip_empty_lines: true }).slice(0, 500);

  console.log("Reading Naukri CSV...");
  const naukriContent = fs.readFileSync(naukriCsvPath, 'utf8');
  const naukriRecords = parse(naukriContent, { columns: true, skip_empty_lines: true }).slice(0, 500);

  const jobsToInsert: any[] = [];

  console.log("Processing LinkedIn Records...");
  for (const record of linkedinRecords as any[]) {
    const title = record.Designation || "Unknown Title";
    const company = record.Company_Name || "LinkedIn Listed Company";
    const location = record.Location || "India";

    // The CSV has many boolean feature columns (PYTHON, JAVA, etc.)
    const skills = Object.entries(record)
      .filter(([k, v]) => v === '1')
      .map(([k]) => k)
      .join(', ');

    const description = `Level: ${record.Level || 'Unspecified'}. Industry: ${record.Industry || 'Unspecified'}. Skills highly relevant: ${skills || 'Not specified'}.`;

    jobsToInsert.push({
      title,
      company,
      location,
      description,
      link: `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(title)}`,
      source: 'LinkedIn CSV'
    });
  }

  console.log("Processing Naukri Records...");
  for (const record of naukriRecords as any[]) {
    const title = record['Job Title'] || "Unknown Title";
    const company = "Naukri Listed Company"; // Naukri CSV doesn't have an explicit company column sometimes
    const location = record['Location'] || "India";
    const skills = record['Key Skills'] ? String(record['Key Skills']).replace(/\|/g, ', ') : "";
    const description = `Role: ${record['Role Category'] || 'Unspecified'}. Experience: ${record['Job Experience Required'] || 'Unspecified'}. Skills: ${skills}`;

    const keywordUrlSafe = encodeURIComponent(title.toLowerCase().replace(/ /g, '-'));
    const keywordQuery = encodeURIComponent(title);

    // Determine experience from job details
    const expStr = String(record['Job Experience Required'] || "").toLowerCase();
    const entryKeywords = ["entry level", "0 - 1 yrs", "0 - 1 years", "1 - 2 yrs", "1 - 2 years", "0 - 1 year", "0 - 1 yrs", "0 - 2 years", "0 - 2 yrs", "0 - 3 years", "0 - 3 yrs", "0 - 4 years", "0 - 4 yrs", "fresher", "0-1", "0-2", "0-3", "0-4"];

    let exp = "any"; // Default to mid-senior
    if (entryKeywords.some(kw => expStr.includes(kw) || title.toLowerCase().includes(kw))) {
      exp = "entry"; // Assign entry level
    }

    jobsToInsert.push({
      title,
      company,
      location,
      description,
      link: `https://www.naukri.com/${keywordUrlSafe}-jobs?k=${keywordQuery}&experience=${exp}`,
      source: 'Naukri CSV'
    });
  }

  // 1. Deduplication: Fetch existing signatures
  console.log("Fetching existing jobs to prevent duplicate embeddings...");
  const existingJobs = await JobModel.find({}, { title: 1, company: 1 });
  const existingSigs = new Set(existingJobs.map(j => `${j.title}|${j.company}`));

  const newJobsToInsert = jobsToInsert.filter(job => !existingSigs.has(`${job.title}|${job.company}`));

  console.log(`Found ${jobsToInsert.length} total CSV jobs. Skipping ${jobsToInsert.length - newJobsToInsert.length} already in DB.`);
  console.log(`Generating embeddings for ${newJobsToInsert.length} NEW CSV jobs in batches (inserting progressively)...`);

  const batchSize = 10;
  let totalInserted = 0;

  for (let i = 0; i < newJobsToInsert.length; i += batchSize) {
    const batch = newJobsToInsert.slice(i, i + batchSize);
    console.log(`Processing embedding batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(newJobsToInsert.length / batchSize)}`);

    const batchPromises = batch.map(async (job) => {
      try {
        const profileText = `Title: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nDescription: ${job.description}`;
        const embedding = await getEmbedding(profileText, 'passage', process.env.NVIDIA_API_KEY || "");
        return { ...job, embedding };
      } catch (e) {
        console.error(`Failed to embed job: [${job.title}]`, e);
        return null;
      }
    });

    const results = await Promise.all(batchPromises);
    const validResults = results.filter(r => r !== null);

    // 2. Progressive database inserts
    if (validResults.length > 0) {
      const insertedDocs = await JobModel.insertMany(validResults);
      totalInserted += validResults.length;
      console.log(` -> Saved ${validResults.length} jobs to DB (Total progress: ${totalInserted}/${newJobsToInsert.length})`);

      // Sync to ChromaDB
      try {
        const chromaPayload = insertedDocs.map(doc => ({
          id: doc._id.toString(),
          title: doc.title,
          company: doc.company,
          description: doc.description,
          link: doc.link,
          embedding: doc.embedding
        }));
        await addJobsToChroma(chromaPayload);
        console.log(` -> Synced ${chromaPayload.length} jobs to ChromaDB`);
      } catch (e) {
        console.error(" -> Failed to sync to ChromaDB:", e);
      }
    }

    // Pause briefly between batches
    await new Promise(r => setTimeout(r, 500));
  }

  const count = await JobModel.countDocuments();
  console.log(`Done! Total job listings now available in database cache: ${count}`);
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal Error seeding CSV jobs:", err);
  process.exit(1);
});
