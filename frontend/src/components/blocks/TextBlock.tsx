import React, { useState, useEffect } from 'react';
import { Block } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TextBlockProps {
  block: Block;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block, onUpdate, onDelete }) => {
  const [text, setText] = useState(block.content?.text || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text !== block.content?.text) {
        onUpdate({ text });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, block.content?.text, onUpdate]);

  return (
    <div className="group relative">
      <div className="flex items-start space-x-2">
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Start writing..."
            className={`min-h-[80px] resize-none border-none bg-transparent text-base focus:ring-0 focus:border-none ${
              isFocused ? 'bg-accent/50' : 'hover:bg-accent/30'
            } transition-colors`}
          />
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive cursor-pointer"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};