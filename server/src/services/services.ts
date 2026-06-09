// services.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { UserModel } from "../models/user.js";
import { Session } from "../models/session.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

function getAccessSecret() {
  return process.env.ACCESS_TOKEN_SECRET || "access-secret";
}
function getRefreshSecret() {
  return process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
}

// Auth services
export async function verifyUserCredentials(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  return isMatch ? user : null;
}

export function generateAccessTokens(userId: string, role: 'owner' | 'superuser' | 'admin' | 'user') {
  const accessToken = jwt.sign(
    { userId, role },
    getAccessSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  const refreshToken = jwt.sign(
    { userId, role, tokenId: randomBytes(16).toString("hex") },
    getRefreshSecret(),
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  return { accessToken, refreshToken };
}

export async function issueTokens(userId: string, role: 'owner' | 'superuser' | 'admin' | 'user') {
  const tokens = generateAccessTokens(userId, role);
  await saveSession(userId, tokens.refreshToken);
  return tokens;
}

// Session services
export async function saveSession(userId: string, refreshToken: string) {
  const decoded = jwt.verify(refreshToken, getRefreshSecret()) as { userId: string; tokenId: string };
  const tokenIdHash = await bcrypt.hash(decoded.tokenId, 10);
  await Session.create({ 
    userId,tokenIdHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
  });
}

export async function validateSession(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, getRefreshSecret()) as { userId: string; tokenId: string };
    const sessions = await Session.find({ userId: decoded.userId });
    const now = new Date();
    for (const session of sessions) {
      if (session.expiresAt && session.expiresAt < now) {
        await Session.deleteOne({ _id: session._id });
        continue;
      }
      const isValid = await bcrypt.compare(decoded.tokenId, session.tokenIdHash);
      if (isValid) {
        return { userId: decoded.userId, valid: true };
      }
    }
    return { userId: "", valid: false };
  } catch {
    return { userId: "", valid: false };
  }
}

export async function destroySession(userId: string, refreshToken?: string) {
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, getRefreshSecret()) as { userId: string; tokenId: string };
      const sessions = await Session.find({ userId });
      for (const session of sessions) {
        const isValid = await bcrypt.compare(decoded.tokenId, session.tokenIdHash);
        if (isValid) {
          await Session.deleteOne({ _id: session._id });
          return;
        }
      }
    } catch {
      // Ignore token decode errors
    }
  }
  await Session.deleteMany({ userId });
}