import mongoose, { Schema, Document } from 'mongoose';

export interface ITalent extends Document {
  name: string;
  email: string;
  phone: string;
  links: string[];
  profession: string;
  score: number;
  addedAt: Date;
}

const TalentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, default: "Not Found" },
  phone: { type: String, default: "Not Found" },
  links: { type: [String], default: [] },
  profession: { type: String, required: true },
  score: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now }
});

export const TalentModel = mongoose.model<ITalent>('Talent', TalentSchema);
