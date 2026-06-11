import { Router } from 'express';
import multer from 'multer';
import { checkAtsScore } from '../controllers/atsController.js';

const router = Router();
// Use memory storage for quick text extraction without saving files to disk
const upload = multer({ storage: multer.memoryStorage() });

router.post('/check', upload.single('resume'), checkAtsScore);

export default router;
