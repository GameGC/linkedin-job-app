// routes/auth.ts
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    const { LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI } = process.env;

    if (!LINKEDIN_CLIENT_ID || !LINKEDIN_REDIRECT_URI) {
        return res.status(500).send('Missing LinkedIn environment variables.');
    }

    const encodedRedirect = encodeURIComponent(LINKEDIN_REDIRECT_URI);
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodedRedirect}&scope=${scope}`;

    res.redirect(authUrl);
});

export default router;
