import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Session } from '../models/session.js';

function getRefreshSecret() {
    return process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
}

// Save refresh token session
export async function saveSession(userId: string, refreshToken: string) {
    const decoded = jwt.verify(refreshToken, getRefreshSecret()) as { userId: string, tokenId: string };
    const tokenIdHash = await bcrypt.hash(decoded.tokenId, 10);

    await Session.create({
        userId,
        tokenIdHash,
        expiresAt: new Date(Date.now() + 7*24*60*60*1000),
    });
}
// validate refresh token and return userId if valid
export async function validateSession(refreshToken: string): Promise<{ userId: string; valid: boolean }> {
    
    try{
        const decoded = jwt.verify(refreshToken, getRefreshSecret()) as { userId: string; tokenId: string };
        const session = await Session.findOne({ userId: decoded.userId});
        if(!session){
            return {userId:'', valid: false};
        }

        const isValid = await bcrypt.compare(decoded.tokenId, session.tokenIdHash);
        return { userId: decoded.userId, valid: isValid};
    }catch{
        return {userId:'', valid: false};
    }
}

// Destroy session (logout)
export async function destroySession(userId: string) {
  await Session.deleteOne({ userId });
}