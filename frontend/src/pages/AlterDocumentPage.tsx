import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CollabEditor from "@/components/CollabEditor";
import { useToast } from "@/hooks/use-toast";
import { JSONContent } from "@tiptap/react";
import {
  ArrowLeft,
  Save,
  Share,
  FileText,
  Users,
  Clock,
  Eye,
  Edit3,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface Document {
  id: string;
  title: string;
  content: any;
  owner_id: number;
  created_at: string;
  updated_at: string;
}
interface User {
  id: number;
  username: string;
  email: string;
}

const AlterDocumentPage = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editorContent, setEditorContent] = useState<JSONContent>({});

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load document on component mount
  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;
            console.log("Editor content updated:", editorContent);
 
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const theuser = await axios.get("http://localhost:4000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(theuser.data);

        // In AlterDocumentPage.tsx, replace the existing axios call with this:
const response = await axios.get(`http://localhost:4000/docs/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Add these detailed logs:
console.log("=== FRONTEND REQUEST DEBUG ===");
console.log("Full response object:", response);
console.log("Response status:", response.status);
console.log("Response headers:", response.headers);
console.log("Response data:", response.data);
console.log("Response data keys:", Object.keys(response.data));
console.log("Content field exists:", 'content' in response.data);
console.log("Content field value:", response.data.content);
console.log("Content field type:", typeof response.data.content);
console.log("=== END DEBUG ===");
console.log('eeeeeeeeeeeeeee', response.data)

setDocument(response.data);
        setTitle(response.data.title);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        toast({
          title: "Error loading document",
          description: err.response?.data?.error || err.message,
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!document) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:4000/docs/${document.id}`,
        { title, content: editorContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLastSaved(new Date());
      toast({
        title: "Document saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error saving document",
        description: err.response?.data?.error || err.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    toast({
      title: "Share feature coming soon!",
      description: "Document sharing will be available in the next update.",
    });
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    if (title !== document?.title) {
      handleSave();
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    }
    if (e.key === "Escape") {
      setTitle(document?.title || "");
      setIsEditingTitle(false);
    }
  };

  const formatLastSaved = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span>Loading document...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </div>

            {/* Center: Document title */}
            <div className="flex-1 max-w-2xl mx-8">
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyPress}
                  className="text-center text-lg font-semibold border-2 border-primary/50 focus:border-primary"
                  autoFocus
                  placeholder="Enter document title..."
                />
              ) : (
                <div
                  onClick={handleTitleEdit}
                  className="flex items-center justify-center space-x-2 group cursor-pointer py-2 px-4 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-semibold text-foreground truncate max-w-md">
                    {title || "Untitled Document"}
                  </h1>
                  <Edit3 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {/* Save status */}
              {lastSaved && (
                <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Saved at {formatLastSaved(lastSaved)}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </>
                  )}
                </Button>

                {/* More options dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={handleShare}
                      className="sm:hidden"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview mode
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      Collaborators
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Document info
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="hidden sm:flex items-center justify-between py-2 text-xs text-muted-foreground border-t border-border/40">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Solo editing
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {document && (
                <>
                  <span>
                    Created {new Date(document.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Modified{" "}
                    {new Date(document.updated_at).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document container */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-border/50 min-h-[800px] relative overflow-hidden">
          {/* Paper effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50" />

          {/* Content area */}
          <div className="relative">
            {/* Page margins visual effect */}
            <div className="absolute left-16 top-0 bottom-0 w-px bg-red-200 dark:bg-red-900/30" />
            <div
              className="absolute left-0 top-0 right-0 h-px bg-border/20"
              style={{ top: "60px" }}
            />

            {/* Editor container */}
            <div
              id="editor-container"
              className="min-h-[750px] p-16 focus-within:outline-none"
              style={{
                paddingLeft: "80px",
                lineHeight: "1.6",
                fontSize: "16px",
              }}
            >
              {/* TipTap Collaborative Editor */}
              {user && id ? (
                <CollabEditor
                  docId={id}
                  userName={user.username}
                  initialContent={document.content || "<p>aaaaaaaaaaaa</p>"}
                  onUpdateContent={setEditorContent}
                />
              ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-muted-foreground/60 italic">
                    <div className="flex items-center justify-center py-20 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Edit3 className="h-8 w-8 text-primary/60" />
                        </div>
                        <p className="text-lg font-medium">Loading Editor...</p>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Preparing collaborative rich text editing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Document ID: {document?.id}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Ready for collaborative editing</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlterDocumentPage;
