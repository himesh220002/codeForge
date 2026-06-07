// routes/authRoutes.ts
import express from "express";
import { loginController, signupController, refreshController, logoutController } from "../controllers/authController.js";

const router = express.Router();
router.post("/login", loginController);
router.post("/signup", signupController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
export default router;
