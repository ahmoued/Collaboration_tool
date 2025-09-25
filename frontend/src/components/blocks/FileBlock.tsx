import React, { useState } from 'react';
import { Block } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal, Trash2, Upload, File, Image, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FileBlockProps {
  block: Block;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export const FileBlock: React.FC<FileBlockProps> = ({ block, onUpdate, onDelete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileContent = block.content || {};

  const handleFileUpload = (file: File) => {
    // In a real implementation, you would upload the file to a storage service
    // and get back a URL. For now, we'll simulate this.
    const mockFileUrl = URL.createObjectURL(file);
    
    onUpdate({
      fileName: file.name,
      fileUrl: mockFileUrl,
      fileType: file.type,
      fileSize: file.size,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (fileType === 'application/pdf' || fileType.includes('text')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="group relative">
      <div className="flex items-start space-x-2">
        <div className="flex-1">
          {fileContent.fileName ? (
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(fileContent.fileType)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {fileContent.fileName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fileContent.fileSize && formatFileSize(fileContent.fileSize)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                </div>
                
                {fileContent.fileType?.startsWith('image/') && (
                  <div className="mt-3">
                    <img
                      src={fileContent.fileUrl}
                      alt={fileContent.fileName}
                      className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card
              className={`border-2 border-dashed transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-accent/50' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <CardContent className="p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports images, PDFs, and documents
                </p>
                <input
                  type="file"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </CardContent>
            </Card>
          )}
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