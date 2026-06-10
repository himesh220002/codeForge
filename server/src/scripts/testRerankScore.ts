import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { JobModel } from '../models/job.js';
import { getEmbedding, cosineSimilarity, rerankJobs } from '../services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // Get query embedding
  const queryText = "Preferences: Web Developer\nCV Profile: John Doe. Experienced in React, Next.js, and Node.js.";
  console.log("Generating query embedding...");
  const queryVector = await getEmbedding(queryText, 'query', process.env.NVIDIA_API_KEY || "");

  // Fetch jobs
  console.log("Fetching jobs from DB...");
  const jobs = await JobModel.find({});
  console.log(`Fetched ${jobs.length} jobs.`);

  // Compute similarity
  const scoredJobs = jobs.map((job) => {
    const score = cosineSimilarity(queryVector, job.embedding);
    return {
      _id: job._id,
      title: job.title,
      company: job.company,
      description: job.description,
      link: job.link,
      score
    };
  });

  scoredJobs.sort((a, b) => b.score - a.score);
  const topMatches = scoredJobs.slice(0, 5);

  console.log("Top matches before rerank:");
  console.log(topMatches.map(j => ({ title: j.title, score: j.score })));

  console.log("Calling rerankJobs...");
  const reranked = await rerankJobs(queryText, topMatches, process.env.NVIDIA_API_KEY || "");

  console.log("Reranked matches returned:");
  console.log(reranked.map(j => ({ title: j.title, score: j.score, rerankLogit: j.rerankLogit })));

  mongoose.connection.close();
}

main().catch(err => {
  console.error("Test failed:", err);
  mongoose.connection.close();
});
