import mongoose , {Schema, Document, Model} from 'mongoose';

export interface ISession extends Document {
    userId: string;
    tokenIdHash: string;
    createdAt: Date;
    expiresAt: Date;
}

const SessionSchema: Schema = new Schema<ISession>({
    userId: { type: String, required: true},
    tokenIdHash: { type: String, required: true},
    createdAt: { type: Date, default: Date.now},
    expiresAt: { type: Date, required: true, expires: 0},
})

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
