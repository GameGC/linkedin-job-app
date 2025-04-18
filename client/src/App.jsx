
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setAuthorized(false);
      }
    }
  };

  const checkAuth = async () => {
    try {
      await axios.get('/api/token');
      setAuthorized(true);
      fetchJobs();
    } catch {
      setAuthorized(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/linkedin';
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>LinkedIn Job Ads</h1>
      {!authorized ? (
        <button onClick={handleLogin}>Login with LinkedIn</button>
      ) : (
        <div>
          <button onClick={fetchJobs}>Refresh Jobs</button>
          <ul>
            {jobs.map((job) => (
              <li key={job.id} style={{ margin: '20px 0' }}>
                <h3>{job.title}</h3>
                <p><strong>{job.company}</strong> – {job.location}</p>
                <p>{job.description?.slice(0, 150)}...</p>
                {job.applyUrl && (
                  <a href={job.applyUrl} target="_blank" rel="noreferrer">
                    Apply
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
