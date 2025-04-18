const axios = require('axios');

module.exports = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await axios.get('https://api.linkedin.com/v2/adCreativesV2', {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
      params: {
        q: 'search',
        count: 10,
        search: {
          type: ['JOB_POSTING'],
        },
      },
    });

    const ads = response.data.elements;

    const jobs = ads.map((ad) => ({
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

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching job ads:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch job ads' });
  }
};
