import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import os from 'os';

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/processes', (req, res) => {
  exec('tasklist /FO CSV /NH', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: 'Failed to fetch process data' });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Failed to fetch process data' });
    }

    const processes = stdout.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const [name, pid, sessionName, sessionNum, memUsage] = line.split('","').map(item => item.replace(/"/g, ''));
        return {
          name,
          pid: parseInt(pid),
          memUsage: parseInt(memUsage.replace(/,/g, '')) / 1024 // Convert to MB
        };
      });

    res.json(processes);
  });
});

app.get('/api/system-stats', (req, res) => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  
  exec('wmic cpu get loadpercentage', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: 'Failed to fetch CPU usage' });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Failed to fetch CPU usage' });
    }

    const cpuUsage = parseInt(stdout.split('\n')[1]);

    res.json({
      totalMemory,
      freeMemory,
      cpuUsage
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:3001`);
});

