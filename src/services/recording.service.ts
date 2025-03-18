import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class RecordingService {
    private readonly chunksDir = path.join(__dirname, '..', 'uploads', 'chunks');
    private readonly finalDir = path.join(__dirname, '..', 'uploads', 'final');

    constructor() {
        fs.mkdirSync(this.chunksDir, { recursive: true });
        fs.mkdirSync(this.finalDir, { recursive: true });
    }

    async saveChunk(file: Express.Multer.File, target: string, sessionId: string): Promise<string> {
        const sessionDir = path.join(this.chunksDir, target, sessionId);
        fs.mkdirSync(sessionDir, { recursive: true });
        fs.mkdirSync(path.join(this.finalDir, target), { recursive: true });
        return file.path;
    }

    async finalizeRecording(target: string, sessionId: string): Promise<string> {
        const sessionDir = path.join(this.chunksDir, target, sessionId);
        const outputPath = path.join(this.finalDir, target, `${sessionId}.mp4`);
        const fileList = path.join(sessionDir, 'files.txt');

        const chunks = fs.readdirSync(sessionDir)
            .filter(file => file.endsWith('.webm'))
            .sort()
            .map(file => path.join(sessionDir, file));

        fs.writeFileSync(fileList, chunks.map(file => `file '${file}'`).join('\n'));

        try {
            await execAsync(
                `ffmpeg -f concat -safe 0 -i "${fileList}" -c:v libx264 -preset fast "${outputPath}"`
            );

            chunks.forEach(chunk => fs.unlinkSync(chunk));
            fs.unlinkSync(fileList);
            fs.rmSync(sessionDir, { recursive: true, force: true });

            return outputPath;
        } catch (error) {
            // @ts-ignore
            throw new Error(`Failed to finalize recording: ${error.message}`);
        }
    }
}

export const recordingService = new RecordingService();