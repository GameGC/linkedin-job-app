import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth';
import callbackRoute from './routes/callback';
import jobsRoute from './routes/jobs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/linkedin/auth', authRoute);
app.use('/api/linkedin/callback', callbackRoute);
app.use('/api/linkedin/jobs', jobsRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
