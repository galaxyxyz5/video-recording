import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
	destination: function(
		req: express.Request,
		file: Express.Multer.File,
		callback: (error: Error | null, destination: string) => void
	) {
		const sessionId = req.params.sessionId;
		console.log('sessionId:', sessionId);
		const dir = path.join(__dirname, '..', 'uploads', 'chunks', sessionId);
		fs.mkdirSync(dir, { recursive: true });
		callback(null, dir);
	},
	filename: function(
		req: express.Request,
		file: Express.Multer.File,
		callback: (error: Error | null, filename: string) => void
	) {
			callback(null, `chunk-${Date.now()}.webm`);
	}
});
  
export const upload = multer({ storage });