// src/middleware/ownerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: 'owner' | 'superuser' | 'admin' | 'user';
}

export function ownerMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'access-secret'
    ) as TokenPayload;

    if (decoded.role !== 'owner') {
      return res.status(403).json({ message: 'Forbidden: Owners only' });
    }

    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
