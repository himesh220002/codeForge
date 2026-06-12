import mongoose, { Schema, Document } from 'mongoose';

export interface IAtsLog extends Document {
  score: number;
  tokensUsed: number;
  processingTimeMs: number;
  candidateName?: string;
  candidatePhone?: string;
  candidateEmail?: string;
  candidateLinks?: string[];
  targetProfession?: string;
  createdAt: Date;
}

const AtsLogSchema: Schema = new Schema({
  score: { type: Number, required: true },
  tokensUsed: { type: Number, required: true },
  processingTimeMs: { type: Number, required: true },
  candidateName: { type: String, default: "Unknown Candidate" },
  candidatePhone: { type: String, default: "Not Found" },
  candidateEmail: { type: String, default: "Not Found" },
  candidateLinks: { type: [String], default: [] },
  targetProfession: { type: String, default: "Unspecified Role" },
  createdAt: { type: Date, default: Date.now }
});

export const AtsLogModel = mongoose.model<IAtsLog>('AtsLog', AtsLogSchema);
