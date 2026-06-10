import mongoose from "mongoose";

export interface IJob extends mongoose.Document {
  title: string;
  company: string;
  description: string;
  link: string;
  embedding: number[];
  createdAt: Date;
}

const jobSchema = new mongoose.Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  embedding: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

export const JobModel = mongoose.model<IJob>("Job", jobSchema);
