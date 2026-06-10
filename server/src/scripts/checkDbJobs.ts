import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { JobModel } from '../models/job.js';

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

  const count = await JobModel.countDocuments();
  console.log(`Total jobs in DB: ${count}`);

  const jobs = await JobModel.find({}).limit(10);
  for (const job of jobs) {
    console.log(`Title: ${job.title}, Embedding Length: ${job.embedding ? job.embedding.length : 'undefined'}`);
  }

  mongoose.connection.close();
}

main().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
