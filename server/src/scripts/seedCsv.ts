import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { JobModel } from '../models/job.js';
import { getEmbedding } from '../services/aiService.js';

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

  const linkedinCsvPath = path.resolve(__dirname, '../../../client/public/csv files/final_data.csv');
  const naukriCsvPath = path.resolve(__dirname, '../../../client/public/csv files/marketing_sample_for_naukri_com-jobs__20190701_20190830__30k_data.csv');

  console.log("Reading LinkedIn CSV...");
  const linkedinContent = fs.readFileSync(linkedinCsvPath, 'utf8');
  const linkedinRecords = parse(linkedinContent, { columns: true, skip_empty_lines: true }).slice(0, 100);

  console.log("Reading Naukri CSV...");
  const naukriContent = fs.readFileSync(naukriCsvPath, 'utf8');
  const naukriRecords = parse(naukriContent, { columns: true, skip_empty_lines: true }).slice(0, 100);

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
    
    jobsToInsert.push({ 
      title, 
      company, 
      location, 
      description, 
      link: `https://www.naukri.com/job-listings`, 
      source: 'Naukri CSV' 
    });
  }

  console.log(`Generating embeddings for ${jobsToInsert.length} CSV jobs in batches (this ensures we don't hit NVIDIA rate limits)...`);
  const batchSize = 10;
  const embeddedJobs = [];

  for (let i = 0; i < jobsToInsert.length; i += batchSize) {
    const batch = jobsToInsert.slice(i, i + batchSize);
    console.log(`Processing embedding batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(jobsToInsert.length / batchSize)}`);
    
    const batchPromises = batch.map(async (job) => {
      try {
        const profileText = `Title: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nDescription: ${job.description}`;
        const embedding = await getEmbedding(profileText, 'passage');
        return { ...job, embedding };
      } catch (e) {
        console.error(`Failed to embed job: [${job.title}]`, e);
        return null;
      }
    });

    const results = await Promise.all(batchPromises);
    embeddedJobs.push(...results.filter(r => r !== null));
    
    // Pause briefly between batches
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`Inserting ${embeddedJobs.length} embedded CSV jobs into MongoDB cache...`);
  await JobModel.insertMany(embeddedJobs);
  
  const count = await JobModel.countDocuments();
  console.log(`Done! Total job listings now available in database cache: ${count}`);
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal Error seeding CSV jobs:", err);
  process.exit(1);
});
