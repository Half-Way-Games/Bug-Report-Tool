import express from 'express';
import path from 'path';
import { createDb } from './services/db.js';
import { createStorage } from './services/storage.js';
import { createIngestRouter } from './routes/ingest.js';
import { createViewerRouter } from './routes/viewer.js';

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/data/uploads';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL?.trim().replace(/^['"]|['"]$/g, '');

if (N8N_WEBHOOK_URL) {
    new URL(N8N_WEBHOOK_URL);
}

// Composition
const db = createDb({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const storage = createStorage(UPLOAD_DIR);

const app = express();

// Middleware
app.use('/bugs/screenshots', express.static(path.resolve(UPLOAD_DIR)));

// Route registration
app.use(createIngestRouter({ storage, N8N_WEBHOOK_URL }));
app.use(createViewerRouter({ db }));

// Start
app.listen(PORT, () => {
    console.log(`Bug Reporter server listening on port ${PORT}`);
});