// routes/callback.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const { code, error: authError } = req.query;
    const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;

    if (authError) {
        return res.status(400).send(`Authorization error: ${authError}`);
    }

    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code from LinkedIn.' });
    }

    if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET || !LINKEDIN_REDIRECT_URI) {
        return res.status(500).json({ error: 'Missing LinkedIn environment variables.' });
    }

    try {
        const tokenRes = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            qs.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: LINKEDIN_REDIRECT_URI,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const { access_token } = tokenRes.data;
        console.log('✅ Access token received:', access_token);

        // Redirect or respond however you need
        res.redirect(`/?access_token=${access_token}`);
    } catch (err: any) {
        console.error('❌ Token exchange failed:', err.response?.data || err.message);
        res.status(500).json({
            error: 'Failed to fetch access token from LinkedIn.',
            details: err.response?.data || err.message,
        });
    }
});

export default router;
