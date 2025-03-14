'use client'

import React, { useState } from 'react';
import ProcessList from '@/components/ProcessList';
import PageReplacementSimulator from '@/components/PageReplacementSimulator';
import SystemStats from '@/components/SystemStats';
import CustomInputForm from '@/components/CustomInputForm';

interface Process {
  name: string;
  pid: number;
  memUsage: number;
}

export default function Home() {
  const [selectedProcesses, setSelectedProcesses] = useState<Process[]>([]);
  const [customPages, setCustomPages] = useState<number[]>([]);
  const [useCustomInput, setUseCustomInput] = useState(false);

  const handleCustomInput = (pages: number[]) => {
    setCustomPages(pages);
    setUseCustomInput(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Page Replacement Algorithm Visualizer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ProcessList onProcessSelect={setSelectedProcesses} />
          <CustomInputForm onSubmit={handleCustomInput} />
          <SystemStats />
        </div>
        <PageReplacementSimulator 
          selectedProcesses={selectedProcesses}
          customPages={customPages}
          useCustomInput={useCustomInput}
        />
      </div>
    </div>
  );
}

