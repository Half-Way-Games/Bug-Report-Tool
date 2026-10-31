import { Router } from 'express';

export function createAPIRouter({db}) {
    const router = Router();

    router.get('/api/bugs', async (req, res) => {
        const bugs = await db.listReports({limit: 50, offset: 0});
        res.json({bugs});
    });

    router.get('/api/bugs/:id', async (req, res) => {
        const bug = await db.getReportById(req.params.id);

        if (!bug) {
            return res.status(404).json({error: 'Bug not found'});
        }

        res.json({bug});
    })

    return router;
}