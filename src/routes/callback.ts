import express, { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const { code } = req.query;
    const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;

    try {
        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', qs.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: LINKEDIN_REDIRECT_URI,
            client_id: LINKEDIN_CLIENT_ID,
            client_secret: LINKEDIN_CLIENT_SECRET,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = response.data;
        console.log('Access Token:', access_token); // Log the access token
        res.redirect(`/?access_token=${access_token}`);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

export default router;
