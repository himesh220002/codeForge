import jwt from 'jsonwebtoken';
import {randomBytes} from 'crypto';
import {saveSession} from './session.js';
import bcrypt from 'bcrypt';
import {UserModel} from '../models/user.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function getAccessSecret() {
  return process.env.ACCESS_TOKEN_SECRET || 'access-secret';
}

function getRefreshSecret() {
  return process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
}

interface ITokenPayload {
  accessToken: string;
  refreshToken: string;
}

//verify user credentials and return user with role
export async function verifyUserCredentials(email: string, password: string) {
  const user = await UserModel.findOne({ email});
  if(!user) return null;

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if(!isMatch) return null;

  return user;
}

// Generate access and refresh tokens
export function generateAccessTokens(userId: string, role: 'user' | 'admin'): ITokenPayload {
  const accessToken = jwt.sign(
    { userId, role },
    getAccessSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  const refreshToken = jwt.sign(
    { 
      userId,
      role,
      tokenId: randomBytes(16).toString('hex')
    }, 
    getRefreshSecret(),
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

// Issue access token + save session
export async function issueTokens(userId: string, role: 'user' | 'admin'): Promise<ITokenPayload> {
  const tokens = generateAccessTokens(userId, role);
  await saveSession(userId, tokens.refreshToken);
  return tokens;
}