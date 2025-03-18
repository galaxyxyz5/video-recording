import { Request, Response } from 'express';
import { recordingService } from '../services/recording.service';

export const saveChunk = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.params.sessionId || !req.params.target) {
      return res.status(400).json({ message: 'Missing file or session ID' });
    }

    const filePath = await recordingService.saveChunk(req.file, req.params.target, req.params.sessionId);

    res.status(200).json({ 
      message: 'Chunk saved successfully',
      chunkPath: filePath
    });
  } catch (error) {
    console.error('Error saving chunk:', error);
    res.status(500).json({ message: 'Error saving chunk' });
  }
};

export const finalizeRecording = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const { target } = req.params;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID required' });
    }

    const outputPath = await recordingService.finalizeRecording(target, sessionId);

    res.status(200).json({
      message: 'Recording finalized successfully',
      videoPath: outputPath
    });
  } catch (error) {
    console.error('Error finalizing recording:', error);
    res.status(500).json({ 
      message: 'Error finalizing recording',
	  // @ts-ignore
      error: error.message 
    });
  }
};