'use client';

import { useChat } from 'ai/react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useState } from 'react';
import stars from './stars.json';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [selectedStar, setSelectedStar] = useState('');

  const handleSelect = (value: string) => {
    setSelectedStar(value);
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : `${selectedStar}: ` }
          {m.content}
        </div>
      ))}

      <form onSubmit={(e) => handleSubmit(e, {
        data: { star: selectedStar },
      })} className='fixed bottom-0 w-full'>
      <Select value={selectedStar} onValueChange={handleSelect}>
        <SelectTrigger className="max-w-md p-2 mb-3">
          <SelectValue placeholder="Select a star" />
        </SelectTrigger>
        <SelectContent>
          {/* Map over the stars and create an item for each */}
          {stars.map((star) => (
            <SelectItem key={star.name} value={star.name}>
              {star.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
        <Input
          className="max-w-md p-2 mb-8"
          value={input}
          placeholder="Ask questions..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}