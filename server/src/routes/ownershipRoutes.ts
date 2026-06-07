// routes/ownershipRoutes.ts
import express from "express";
import { ownerMiddleware } from "../middleware/ownerMiddleware.js";
import { transferOwnershipController } from "../controllers/ownershipController.js";

const router = express.Router();

// Only owner can transfer ownership
router.post("/transfer-ownership", ownerMiddleware, transferOwnershipController);

export default router;
