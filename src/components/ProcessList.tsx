import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface Process {
  name: string;
  pid: number;
  memUsage: number;
}

interface ProcessListProps {
  onProcessSelect: (processes: Process[]) => void;
}

const ProcessList: React.FC<ProcessListProps> = ({ onProcessSelect }) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<Process[]>([]);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/processes');
        setProcesses(response.data);
      } catch (error) {
        console.error('Failed to fetch processes:', error);
      }
    };

    fetchProcesses();
    const interval = setInterval(fetchProcesses, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProcessSelect = (process: Process) => {
    setSelectedProcesses(prev => {
      const newSelection = prev.find(p => p.pid === process.pid)
        ? prev.filter(p => p.pid !== process.pid)
        : [...prev, process];
      return newSelection;
    });
  };

  useEffect(() => {
    onProcessSelect(selectedProcesses);
  }, [selectedProcesses, onProcessSelect]);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Process List</h2>
      <div className="h-64 overflow-y-auto border border-gray-300 rounded">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>PID</TableHead>
              <TableHead>Memory (MB)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map(process => (
              <TableRow key={process.pid}>
                <TableCell>
                  <Checkbox
                    checked={selectedProcesses.some(p => p.pid === process.pid)}
                    onCheckedChange={() => handleProcessSelect(process)}
                  />
                </TableCell>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.pid}</TableCell>
                <TableCell>{process.memUsage.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProcessList;

