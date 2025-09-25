import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Type, AlignLeft, CheckSquare, Upload, X } from 'lucide-react';

interface BlockTypePickerProps {
  onSelect: (type: string) => void;
  onCancel: () => void;
}

export const BlockTypePicker: React.FC<BlockTypePickerProps> = ({ onSelect, onCancel }) => {
  const blockTypes = [
    {
      type: 'text',
      icon: AlignLeft,
      label: 'Text',
      description: 'Just start writing with plain text.',
    },
    {
      type: 'heading',
      icon: Type,
      label: 'Heading',
      description: 'Big section heading.',
    },
    {
      type: 'checklist',
      icon: CheckSquare,
      label: 'To-do list',
      description: 'Track tasks with a to-do list.',
    },
    {
      type: 'file',
      icon: Upload,
      label: 'File & media',
      description: 'Upload images, PDFs, and other files.',
    },
  ];

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-2">
        <div className="flex items-center justify-between mb-2 px-2 py-1">
          <span className="text-sm font-medium text-muted-foreground">Add a block</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {blockTypes.map(({ type, icon: Icon, label, description }) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => onSelect(type)}
              className="w-full justify-start h-auto p-3 text-left"
            >
              <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};