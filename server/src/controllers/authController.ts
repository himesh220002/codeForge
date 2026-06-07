// controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.js";
import { verifyUserCredentials, issueTokens, validateSession, destroySession } from "../services/services.js";

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await verifyUserCredentials(email, password);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = await issueTokens(user.id, user.role);
    const isProd = process.env.NODE_ENV === "production";
    const cookie = `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=608400; SameSite=Lax${isProd ? "; Secure" : ""}`;
    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({ message: "Login successful", accessToken, role: user.role, name: user.name });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function signupController(req: Request, res: Response) {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, passwordHash, role: "user", createdAt: new Date() });
    await newUser.save();

    const { accessToken, refreshToken } = await issueTokens(newUser.id, newUser.role);
    const isProd = process.env.NODE_ENV === "production";
    const cookie = `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=608400; SameSite=Lax${isProd ? "; Secure" : ""}`;
    res.setHeader("Set-Cookie", cookie);

    return res.status(201).json({ message: "Signup successful", accessToken, role: newUser.role, name: newUser.name });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Refresh token controller
export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  const { userId, valid } = await validateSession(refreshToken);
  if (!valid) return res.status(403).json({ message: "Invalid refresh token" });

  // 🔑 Always fetch latest role from DB
  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Issue new tokens
  const tokens = await issueTokens(userId, user.role); // role can be looked up if needed
  res.json({ message: "Token refreshed", ...tokens });
}

// Logout controller
export async function logoutController(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: "No refresh token" });

  const { userId, valid } = await validateSession(refreshToken);
  if (valid) await destroySession(userId);

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
}