import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Document, Block } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Share2,
  Save,
  MoreHorizontal
} from 'lucide-react';
import { TextBlock } from '@/components/blocks/TextBlock';
import { HeadingBlock } from '@/components/blocks/HeadingBlock';
import { ChecklistBlock } from '@/components/blocks/ChecklistBlock';
import { FileBlock } from '@/components/blocks/FileBlock';
import { BlockTypePicker } from '@/components/editor/BlockTypePicker';
import { CollaborationIndicator } from '@/components/editor/CollaborationIndicator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for preview
const mockUser = {
  id: '1',
  username: 'demo_user',
  email: 'demo@example.com'
};

const mockDocuments: { [key: string]: Document } = {
  '1': {
    id: '1',
    title: 'Project Planning Document',
    owner_id: '1',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-20T14:30:00Z'
  },
  '2': {
    id: '2',
    title: 'Team Meeting Notes',
    owner_id: '1',
    created_at: '2025-01-18T09:00:00Z',
    updated_at: '2025-01-19T16:45:00Z'
  }
};

const mockBlocks: { [key: string]: Block[] } = {
  '1': [
    {
      id: 'b1',
      document_id: '1',
      type: 'heading',
      content: { text: 'Project Overview', level: 1 },
      position: 0,
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-20T14:30:00Z'
    },
    {
      id: 'b2',
      document_id: '1',
      type: 'text',
      content: { text: 'This document outlines the key objectives and milestones for our upcoming project. We will be focusing on creating a collaborative editing platform that enables real-time document sharing.' },
      position: 1,
      created_at: '2025-01-15T10:05:00Z',
      updated_at: '2025-01-20T14:30:00Z'
    },
    {
      id: 'b3',
      document_id: '1',
      type: 'heading',
      content: { text: 'Key Features', level: 2 },
      position: 2,
      created_at: '2025-01-15T10:10:00Z',
      updated_at: '2025-01-20T14:30:00Z'
    },
    {
      id: 'b4',
      document_id: '1',
      type: 'checklist',
      content: { 
        items: [
          { text: 'Real-time collaborative editing', checked: true },
          { text: 'Block-based document structure', checked: true },
          { text: 'User authentication system', checked: false },
          { text: 'File upload and media support', checked: false }
        ]
      },
      position: 3,
      created_at: '2025-01-15T10:15:00Z',
      updated_at: '2025-01-20T14:30:00Z'
    }
  ],
  '2': [
    {
      id: 'b5',
      document_id: '2',
      type: 'heading',
      content: { text: 'Weekly Team Sync', level: 1 },
      position: 0,
      created_at: '2025-01-18T09:00:00Z',
      updated_at: '2025-01-19T16:45:00Z'
    },
    {
      id: 'b6',
      document_id: '2',
      type: 'text',
      content: { text: 'Meeting held on January 18th, 2025. All team members present.' },
      position: 1,
      created_at: '2025-01-18T09:05:00Z',
      updated_at: '2025-01-19T16:45:00Z'
    }
  ]
};

const DocumentEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [showTypePicker, setShowTypePicker] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (documentId) {
      // Load mock data
      const mockDoc = mockDocuments[documentId];
      const mockDocBlocks = mockBlocks[documentId] || [];
      
      if (mockDoc) {
        setDocument(mockDoc);
        setTitle(mockDoc.title);
        setBlocks(mockDocBlocks);
      }
      setIsLoading(false);
    }
  }, [documentId]);

  const saveTitle = async () => {
    if (!document || !title.trim()) return;
    
    setIsSaving(true);
    // Mock save - in real app this would call the API
    setDocument(prev => prev ? { ...prev, title: title.trim() } : null);
    toast({
      title: "Document saved",
      description: "Title updated successfully.",
    });
    setIsSaving(false);
  };

  const createBlock = async (type: string, position: number) => {
    if (!documentId) return;

    const defaultContent = {
      text: { text: '' },
      heading: { text: '', level: 1 },
      checklist: { items: [{ text: '', checked: false }] },
      file: { fileName: '', fileUrl: '', fileType: '' }
    };

    // Mock block creation
    const newBlock: Block = {
      id: `mock-${Date.now()}`,
      document_id: documentId,
      type,
      content: defaultContent[type as keyof typeof defaultContent],
      position,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setBlocks(prev => [...prev, newBlock].sort((a, b) => a.position - b.position));
    setShowTypePicker(null);
    
    toast({
      title: "Block added",
      description: `New ${type} block created.`,
    });
  };

  const updateBlock = async (blockId: string, content: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  const deleteBlock = async (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    toast({
      title: "Block deleted",
      description: "Block has been removed.",
    });
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      key: block.id,
      block,
      onUpdate: (content: any) => updateBlock(block.id, content),
      onDelete: () => deleteBlock(block.id),
    };

    switch (block.type) {
      case 'text':
        return <TextBlock {...commonProps} />;
      case 'heading':
        return <HeadingBlock {...commonProps} />;
      case 'checklist':
        return <ChecklistBlock {...commonProps} />;
      case 'file':
        return <FileBlock {...commonProps} />;
      default:
        return <TextBlock {...commonProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Document not found</h2>
          <p className="text-muted-foreground mb-4">The document you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 min-w-0">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={saveTitle}
                  className="border-none bg-transparent text-lg font-medium focus:ring-0 px-0"
                  placeholder="Document title..."
                />
              </div>
              
              {isSaving && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Save className="h-3 w-3" />
                  <span>Saving...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <CollaborationIndicator users={[mockUser]} />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Users className="h-4 w-4 mr-2" />
                    Share document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Document settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-2">
          {blocks.map(renderBlock)}
          
          {/* Add block button */}
          <div className="flex items-center space-x-2 py-2">
            {showTypePicker !== null ? (
              <BlockTypePicker
                onSelect={(type) => createBlock(type, blocks.length)}
                onCancel={() => setShowTypePicker(null)}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTypePicker(blocks.length)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add block
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentEditor;