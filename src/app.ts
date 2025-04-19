import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';

import authRoute from './routes/auth';
import callbackRoute from './routes/callback';
import jobsRoute from './routes/jobs';

dotenv.config();

const app = express();

// Serve static files from /public
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/linkedin/auth', authRoute);
app.use('/api/linkedin/callback', callbackRoute);
app.use('/api/linkedin/jobs', jobsRoute);

// Fallback to index.html for root route (Single Page App behavior)
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ⛔️ DO NOT call app.listen here!
// ✅ Instead, export the app wrapped as a Vercel-compatible handler
module.exports = app;
