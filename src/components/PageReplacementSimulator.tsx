import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import Select from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Frame {
  pid: number;
  name: string;
}

interface PageReplacementStep {
  page: number;
  frames: Frame[];
  isPageFault: boolean;
}

interface PageReplacementSimulatorProps {
  selectedProcesses: Frame[];
  customPages: number[];
  useCustomInput: boolean;
}

const PageReplacementSimulator: React.FC<PageReplacementSimulatorProps> = ({ 
  selectedProcesses, 
  customPages,
  useCustomInput
}) => {
  const [algorithm, setAlgorithm] = useState<'FIFO' | 'LRU'>('FIFO');
  const [frames, setFrames] = useState<Frame[]>([]);
  const [pageRequests, setPageRequests] = useState<number[]>([]);
  const [steps, setSteps] = useState<PageReplacementStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [pageFaults, setPageFaults] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  useEffect(() => {
    if (useCustomInput) {
      setPageRequests(customPages);
    } else {
      setPageRequests(selectedProcesses.map(p => p.pid));
    }
    resetSimulation();
  }, [selectedProcesses, customPages, useCustomInput]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < pageRequests.length - 1) {
      timer = setTimeout(() => {
        simulateStep();
      }, playbackSpeed);
    } else if (currentStep >= pageRequests.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, pageRequests.length, playbackSpeed]);

  const resetSimulation = () => {
    setFrames([]);
    setSteps([]);
    setCurrentStep(-1);
    setPageFaults(0);
    setIsPlaying(false);
  };

  const simulateStep = () => {
    if (currentStep >= pageRequests.length - 1) {
      setIsPlaying(false);
      return;
    }

    const nextStep = currentStep + 1;
    const currentPage = pageRequests[nextStep];
    let newFrames = [...frames];
    let isPageFault = false;

    if (!newFrames.some(frame => frame.pid === currentPage)) {
      isPageFault = true;
      if (newFrames.length < 3) {
        newFrames.push(createFrame(currentPage));
      } else {
        if (algorithm === 'FIFO') {
          newFrames.shift();
          newFrames.push(createFrame(currentPage));
        } else if (algorithm === 'LRU') {
          newFrames.pop();
          newFrames.unshift(createFrame(currentPage));
        }
      }
      setPageFaults(prev => prev + 1);
    } else if (algorithm === 'LRU') {
      const index = newFrames.findIndex(frame => frame.pid === currentPage);
      const frame = newFrames.splice(index, 1)[0];
      newFrames.unshift(frame);
    }

    setFrames(newFrames);
    setSteps(prev => [...prev, { page: currentPage, frames: newFrames, isPageFault }]);
    setCurrentStep(nextStep);
  };

  const createFrame = (pid: number): Frame => {
    const process = selectedProcesses.find(p => p.pid === pid);
    return { 
      pid, 
      name: process ? process.name : `Process ${pid}`
    };
  };

  const handlePlay = () => {
    if (currentStep >= pageRequests.length - 1) {
      resetSimulation();
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);
  const handleReset = resetSimulation;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Page Replacement Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="mr-2">Algorithm:</label>
          <Select
            options={[
              { value: 'FIFO', label: 'FIFO' },
              { value: 'LRU', label: 'LRU' },
            ]}
            value={algorithm}
            onChange={(value) => {
              setAlgorithm(value as 'FIFO' | 'LRU');
              resetSimulation();
            }}
            placeholder="Choose algorithm"
            className="w-48"
          />
        </div>
        <div className="mb-4">
          <label className="mr-2">Playback Speed (ms):</label>
          <input
            type="number"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="border rounded p-1"
            min="100"
            max="5000"
            step="100"
          />
        </div>
        <div className="mb-4">
          <Button onClick={handlePlay} disabled={isPlaying || pageRequests.length === 0}>Play</Button>
          <Button onClick={handlePause} disabled={!isPlaying} className="ml-2">Pause</Button>
          <Button onClick={handleReset} className="ml-2">Reset</Button>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Current Frames:</h3>
          <div className="flex space-x-2">
            {frames.map((frame, index) => (
              <div key={index} className="border p-2 rounded">
                {frame.name} (PID: {frame.pid})
              </div>
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Step</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Frames</TableHead>
              <TableHead>Page Fault</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step, index) => (
              <TableRow key={index} className={index === currentStep ? "bg-muted" : ""}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{step.page}</TableCell>
                <TableCell>{step.frames.map(f => f.pid).join(', ')}</TableCell>
                <TableCell>{step.isPageFault ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <p>Current Step: {currentStep + 1}</p>
          <p>Page Faults: {pageFaults}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageReplacementSimulator;

