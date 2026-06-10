import express from "express";
import { seedJobsController, matchJobsController } from "../controllers/jobController.js";

const router = express.Router();

// Route to seed mock developer jobs and pre-generate embeddings
router.post("/seed", seedJobsController);

// Route to match CV and query against seeded jobs
router.post("/match", matchJobsController);

export default router;
