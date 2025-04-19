import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    const { LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI } = process.env;
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${LINKEDIN_REDIRECT_URI}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    res.redirect(authUrl);
});

export default router;
