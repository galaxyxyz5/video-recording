import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { saveChunk, finalizeRecording } from '../controllers/recording.controller';

const router = Router();

router.post('/recordings/:target/chunk/:sessionId', upload.single('video'), saveChunk);
router.post('/recordings/:target/finalize', finalizeRecording);

export default router;