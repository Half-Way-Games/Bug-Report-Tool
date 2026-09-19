import { Router } from 'express';
import Busboy from 'busboy';
import crypto from 'crypto';

export function createIngestRouter({storage, n8nWebhookUrl} ) {
    const router = Router();

    router.post('/bug-report', (req, res) => {
        const bb = Busboy({ headers: req.headers });
        const tempId = crypto.randomUUID();
        let payloadData = null;
        let screenshotPath = null;
        const filePromises = [];

        console.log("received a bug report");

        bb.on('field', (name, val) => {
            if (name === 'payload') {
                try {
                    payloadData = JSON.parse(val);
                } catch (e) {
                    console.error('Failed to parse payload JSON', e);
                }
            }
        });

        bb.on('file', (name, file, info) => {
            if (name === 'screenshot') {
                const promise = storage.saveScreenshot(tempId, file, info.filename)
                    .then(path => { screenshotPath = path; });
                filePromises.push(promise);
            } else {
                file.resume();
            }
        });

        bb.on('finish', async () => {
            try {
                await Promise.all(filePromises);

                if (!payloadData) {
                    console.log("missing or invalid payload");
                    return res.status(400).send('Missing or invalid payload');
                }

                const report = {
                    build_version: payloadData.meta.build_version || 'unknown',
                    reporter_note: payloadData.meta.reporter_note || 'No note added',
                    platform: payloadData.meta.platform,
                    hardware_stats: payloadData.meta.hardware_stats,
                    screenshot_path: screenshotPath,
                    data: payloadData.data
                };

              fetch(n8nWebhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(report)
              }).catch(err => console.error('Failed to forward to n8n:', err));


                res.status(204).end();
            } catch (err) {
                console.error('Ingestion error:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        req.pipe(bb);
    });

    return router;
}
