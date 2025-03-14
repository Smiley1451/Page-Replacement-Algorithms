import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CustomInputFormProps {
  onSubmit: (pages: number[]) => void;
}

const CustomInputForm: React.FC<CustomInputFormProps> = ({ onSubmit }) => {
  const [pageString, setPageString] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pages = pageString.split(' ').map(Number).filter(n => !isNaN(n));
    onSubmit(pages);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Label htmlFor="pageString">Custom Page Reference String</Label>
      <Input
        id="pageString"
        value={pageString}
        onChange={(e) => setPageString(e.target.value)}
        placeholder="Enter page numbers separated by spaces"
        className="mb-2"
      />
      <Button type="submit">Use Custom Input</Button>
    </form>
  );
};

export default CustomInputForm;

