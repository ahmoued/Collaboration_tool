import React, { useState, useEffect } from 'react';
import { Block } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Trash2, Plus, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface ChecklistBlockProps {
  block: Block;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export const ChecklistBlock: React.FC<ChecklistBlockProps> = ({ block, onUpdate, onDelete }) => {
  const [items, setItems] = useState<ChecklistItem[]>(
    block.content?.items || [{ text: '', checked: false }]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ items });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [items, onUpdate]);

  const updateItem = (index: number, field: keyof ChecklistItem, value: string | boolean) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems(prev => [...prev, { text: '', checked: false }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-start space-x-2">
        <div className="flex-1 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 group/item">
              <Checkbox
                checked={item.checked}
                onCheckedChange={(checked) => updateItem(index, 'checked', !!checked)}
                className="mt-2"
              />
              <div className="flex-1">
                <Input
                  value={item.text}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
                  placeholder="List item..."
                  className={`border-none bg-transparent focus:ring-0 focus:border-none hover:bg-accent/30 transition-colors ${
                    item.checked ? 'line-through text-muted-foreground' : ''
                  }`}
                />
              </div>
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-6 w-6 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={addItem}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add item
          </Button>
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