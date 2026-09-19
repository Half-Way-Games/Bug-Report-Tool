import { Router } from 'express';
import { renderPage } from '../services/render.jsx';
import BugsIndex from '../views/bugs-index.jsx';
import BugsDetail from '../views/bugs-detail.jsx';

export function createViewerRouter({ db }) {
    const router = Router();

    router.get('/bugs/', async (req, res) => {
        try {
            const bugs = await db.listReports({ limit: 50, offset: 0 });
            res.send(renderPage(BugsIndex, { Bugs: bugs }));
        } catch (err) {
            console.error('Failed to list bugs:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    router.get('/bugs/:id', async (req, res) => {
        try {
            const bug = await db.getReportById(req.params.id);
            if (!bug) {
                return res.status(404).send('Bug not found');
            }
            res.send(renderPage(BugsDetail, { Bug: bug }));
        } catch (err) {
            console.error('Failed to get bug detail:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
}
