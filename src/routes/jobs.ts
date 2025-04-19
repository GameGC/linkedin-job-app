import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const { access_token } = req.query;

    try {
        const response = await axios.get('https://api.linkedin.com/v2/jobs', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

export default router;
