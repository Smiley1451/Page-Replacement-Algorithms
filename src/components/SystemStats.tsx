import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SystemStats {
  totalMemory: number;
  freeMemory: number;
  cpuUsage: number;
}

const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/system-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <div>Loading system stats...</div>;
  }

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">System Statistics</h2>
      <p>Total Memory: {(stats.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB</p>
      <p>Free Memory: {(stats.freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB</p>
      <p>CPU Usage: {stats.cpuUsage.toFixed(2)}%</p>
    </div>
  );
};

export default SystemStats;

