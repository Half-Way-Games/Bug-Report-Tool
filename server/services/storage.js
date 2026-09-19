import fs from 'fs/promises';
import {createWriteStream} from 'fs';
import path from 'path';
import {pipeline} from 'stream/promises';

export function createStorage(uploadDir) {
    const fullUploadDir = path.resolve(uploadDir);

    async function ensureDir(dir) {
        await fs.mkdir(dir, { recursive: true });
    }

    return {
        async saveScreenshot(reportId, stream, filename) {
            const relativeDir = new Date().toISOString().slice(0, 10);
            const absoluteDir = path.join(fullUploadDir, relativeDir);
            
            await ensureDir(absoluteDir);

            const ext = path.extname(filename) || '.jpg';
            const relativePath = path.join(relativeDir, `${reportId}${ext}`);
            const absolutePath = path.join(fullUploadDir, relativePath);

            await pipeline(stream, createWriteStream(absolutePath));

            return relativePath;
        }
    };
}
