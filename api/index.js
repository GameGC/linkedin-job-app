const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let accessToken = null;

const {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  REDIRECT_URI,
  PORT = 3001
} = process.env;

// Step 1: Redirect users to LinkedIn authorization page
app.get('/auth/linkedin', (req, res) => {
  const authURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=r_ads+r_liteprofile`;
  res.redirect(authURL);
});

// Step 2: LinkedIn OAuth callback handler to exchange authorization code for access token
app.get('/auth/linkedin/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    accessToken = response.data.access_token;
    res.redirect('http://localhost:3000'); // Redirect to the frontend, update this URL as needed
  } catch (err) {
    res.status(500).send('OAuth failed');
  }
});

// Step 3: Provide the access token
app.get('/api/token', (req, res) => {
  if (!accessToken) return res.status(403).json({ error: 'Unauthorized' });
  res.json({ accessToken });
});

// Step 4: Fetch LinkedIn job postings using access token
app.get('/api/jobs', async (req, res) => {
  if (!accessToken) return res.status(403).json({ error: 'Unauthorized' });

  try {
    const response = await axios.get('https://api.linkedin.com/v2/adCreativesV2', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
      params: {
        q: 'search',
        count: 5,
        'search.type.values[0]': 'JOB_POSTING',
      },
    });

    const jobs = response.data.elements.map(ad => ({
      id: ad.id,
      title: ad.headline || "Unknown",
      company: ad.account?.name || "Unknown Company",
      location: ad.location || "Remote / Not specified",
      timePosted: ad.lastModified?.time || new Date().toISOString(),
      applicants: ad.metrics?.totalClicks || 0,
      workType: ad.jobDetails?.workType || [],
      easyApply: !!ad.jobDetails?.easyApply,
      logo: ad.companyLogoUrl || null,
      description: ad.description?.text || null,
      applyUrl: ad.landingPageUrl || null,
      hiringTeam: ad.jobDetails?.hiringTeam
          ? {
            name: ad.jobDetails.hiringTeam.name,
            title: ad.jobDetails.hiringTeam.title,
            connection: ad.jobDetails.hiringTeam.connectionDegree,
            messageUrl: ad.jobDetails.hiringTeam.messageUrl,
          }
          : null,
    }));

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
