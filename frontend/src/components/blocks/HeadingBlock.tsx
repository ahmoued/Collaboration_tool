import React, { useState, useEffect } from 'react';
import { Block } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Trash2, Type } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeadingBlockProps {
  block: Block;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ block, onUpdate, onDelete }) => {
  const [text, setText] = useState(block.content?.text || '');
  const [level, setLevel] = useState(block.content?.level || 1);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text !== block.content?.text || level !== block.content?.level) {
        onUpdate({ text, level });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, level, block.content?.text, block.content?.level, onUpdate]);

  const getHeadingClass = (headingLevel: number) => {
    switch (headingLevel) {
      case 1:
        return 'text-3xl font-bold';
      case 2:
        return 'text-2xl font-semibold';
      case 3:
        return 'text-xl font-medium';
      default:
        return 'text-lg font-medium';
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-start space-x-2">
        <div className="flex-1">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={`Heading ${level}`}
            className={`border-none bg-transparent focus:ring-0 focus:border-none ${getHeadingClass(level)} ${
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
              <DropdownMenuItem onClick={() => setLevel(1)}>
                <Type className="h-4 w-4 mr-2" />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLevel(2)}>
                <Type className="h-4 w-4 mr-2" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLevel(3)}>
                <Type className="h-4 w-4 mr-2" />
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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