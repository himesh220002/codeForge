import express from "express";
import { createContactController, getContactsController } from "../controllers/contactController.js";

const router = express.Router();

router.post('/', createContactController);

router.get('/',getContactsController);

export default router;