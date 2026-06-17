import express from "express";
import { getUserSettingsController, updateUserSettingsController } from "../controllers/userController.js";
import { requireAuth } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/settings", requireAuth, getUserSettingsController);
router.post("/settings", requireAuth, updateUserSettingsController);

export default router;
