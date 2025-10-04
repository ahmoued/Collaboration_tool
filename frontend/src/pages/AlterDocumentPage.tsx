import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CollabEditor from "@/components/CollabEditor";
import CollaborationManager from "@/components/CollaborationManager";
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
  Globe,
  Lock,
  User,
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

        const theuser = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(theuser.data);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/docs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        `${import.meta.env.VITE_API_URL}/docs/${document.id}`,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-slate-300/50">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-300/30 rounded-full animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animate-reverse delay-150" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Loading document...
            </h3>
            <p className="text-slate-600">
              Please wait while we prepare your workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-100 to-slate-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      {/* Modern Header */}
      <header className="sticky top-0 z-50 border-b border-slate-300/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 hover:bg-purple-200/30 transition-all duration-300 rounded-xl group border border-transparent hover:border-purple-400/30"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="font-medium">Dashboard</span>
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
                  className="text-center text-lg font-semibold border-2 border-purple-300/50 focus:border-purple-400 bg-white/80 backdrop-blur-sm text-slate-800 placeholder:text-slate-500 rounded-xl shadow-lg focus:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-purple-500/20"
                  autoFocus
                  placeholder="Enter document title..."
                />
              ) : (
                <div
                  onClick={handleTitleEdit}
                  className="flex items-center justify-center space-x-3 group cursor-pointer py-3 px-6 rounded-xl hover:bg-gradient-to-r hover:from-purple-200/30 hover:to-pink-200/30 transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm border border-transparent hover:border-purple-400/30"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent truncate max-w-md">
                    {title || "Untitled Document"}
                  </h1>
                  <Edit3 className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {/* Save status */}
              {lastSaved && (
                <div className="hidden lg:flex items-center space-x-2 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
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
                  className="hidden sm:flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-purple-300/50 hover:bg-purple-200/30 hover:border-purple-400 text-purple-600 hover:text-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
                >
                  <Share className="h-4 w-4" />
                  <span className="font-medium">Share</span>
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="sm"
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl font-medium disabled:opacity-50 disabled:scale-100"
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 hover:bg-purple-200/30 rounded-xl transition-all duration-300 hover:scale-110"
                    >
                      <MoreVertical className="h-4 w-4 text-purple-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white/90 backdrop-blur-xl border-slate-300/50 shadow-xl"
                  >
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

          {/* Modern Status bar */}
          <div className="hidden md:flex items-center justify-between py-3 text-xs border-t border-slate-300/30 bg-gradient-to-r from-purple-100/50 to-pink-100/50">
            <div className="flex items-center space-x-4">
              <Badge className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-3 py-1">
                <Lock className="h-3 w-3" />
                <span className="font-medium">Private Document</span>
              </Badge>
              <Badge className="flex items-center space-x-1.5 bg-white/80 text-slate-600 border border-slate-400/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-3 py-1">
                <User className="h-3 w-3" />
                <span className="font-medium">Solo editing</span>
              </Badge>
              <div className="flex items-center space-x-2 text-cyan-400">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" />
                <span className="font-medium">Live collaboration ready</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-slate-600">
              {document && (
                <>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Created</span>
                    <span className="text-purple-400 font-semibold">
                      {new Date(document.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-purple-300">•</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Modified</span>
                    <span className="text-pink-400 font-semibold">
                      {new Date(document.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8 relative z-10">
        {/* Modern Document container */}
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-300/40 min-h-[800px] relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
          {/* Enhanced paper effect with subtle patterns */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white/90 to-slate-100/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(147,51,234,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-30" />

          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-3000 ease-in-out" />

          {/* Content area with improved margins */}
          <div className="relative z-10">
            {/* Enhanced margin indicators */}
            <div className="absolute left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-300/60 to-transparent" />
            <div className="absolute left-18 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-200/40 to-transparent" />

            {/* Top margin line */}
            <div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
              style={{ top: "80px" }}
            />

            {/* Notebook holes effect */}
            <div className="absolute left-4 top-16 space-y-8">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 shadow-inner border border-slate-400/50"
                />
              ))}
            </div>

            {/* Editor container with improved spacing */}
            <div
              id="editor-container"
              className="min-h-[750px] p-20 focus-within:outline-none"
              style={{
                paddingLeft: "100px",
                lineHeight: "1.7",
                fontSize: "16px",
              }}
            >
              {/* TipTap Collaborative Editor */}
              {user && id ? (
                <CollabEditor
                  docId={id}
                  userName={user.username}
                  initialContent={
                    document?.content || "<p>Start writing your document...</p>"
                  }
                  onUpdateContent={setEditorContent}
                />
              ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-center py-20">
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-purple-500/50">
                          <Edit3 className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Loading Editor...
                        </p>
                        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                          Preparing your beautiful collaborative workspace with
                          real-time editing capabilities
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-800/30 to-transparent pointer-events-none"></div>
        </div>

        {/* Enhanced Footer info */}
        <div className="mt-8 p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-300/30 shadow-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-purple-400">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                <span className="font-medium">Document ID:</span>
                <code className="px-2 py-1 bg-purple-100/80 rounded-md text-xs font-mono text-purple-700 border border-purple-300/50">
                  {document?.id}
                </code>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium">
                Ready for collaborative editing
              </span>
            </div>
          </div>

          {/* Additional status indicators */}
          <div className="mt-4 pt-4 border-t border-purple-800/30 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Autosave enabled</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>Real-time sync</span>
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Enhanced collaborative workspace v2.0
            </div>
          </div>
        </div>
      </main>

      {/* Collaboration Manager */}
      <CollaborationManager
        documentId={id!}
        currentUserId={user?.id || 0}
        isOwner={user?.id === document?.owner_id}
      />
    </div>
  );
};

export default AlterDocumentPage;
