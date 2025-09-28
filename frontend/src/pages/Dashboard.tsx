import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Plus,
  FileText,
  Search,
  MoreVertical,
  Trash2,
  Edit3,
  Calendar,
  User,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type User = {
  id: number;
  username: string;
  email: string;
};
interface Document {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}


const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetching = async () => {
      setIsLoading(true);
      try {
        const token = await localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user data
        const userResult = await axios.get("http://localhost:4000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResult.data);

        // Fetch documents
        const docsResult = await axios.get("http://localhost:4000/docs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments(docsResult.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        toast({
          title: "Error fetching documents",
          description: err.response?.data?.error || err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetching();
  }, []);

  const createDocument = async () => {

    try{
    const token = await localStorage.getItem("token")
    if (!token) navigate("/login")
    navigate("/create-document")
    } catch(err: any){
      console.log("error creating new doc", err.message)
      throw new Error(err.message)

  }
}

  const deleteDocument = async (docId: string) => {
    setDocuments((prev) => (prev || []).filter((doc) => doc.id !== docId));
    toast({
      title: "Document deleted",
      description: "The document has been permanently deleted.",
    });
  };

  const filteredDocuments =
    documents?.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-100 to-slate-200 overflow-hidden">
      {/* Ultra Modern Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-300/20 via-purple-200/15 to-transparent rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-1/3 right-20 w-[500px] h-[500px] bg-gradient-to-bl from-pink-300/18 via-pink-200/12 to-transparent rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-tr from-blue-300/15 via-blue-200/10 to-transparent rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-2/3 left-10 w-64 h-64 bg-gradient-to-r from-purple-300/12 to-pink-300/12 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Stunning Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-slate-300/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <Edit3 className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  CollabEditor
                </h1>
                <p className="text-sm text-slate-600 font-normal">
                  Ultra Modern Collaborative Experience
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-300/40">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">
                    {user?.username || "Loading..."}
                  </span>
                  <span className="text-xs text-slate-600">Premium Editor</span>
                </div>
                <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-lg shadow-success/50"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Ultra Modern Hero Section */}
        <div className="mb-16 text-center animate-slide-up">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-blue-200/30 border border-purple-300/40 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Next-Gen Collaborative Workspace
            </span>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              {user?.username || "Creative Genius"}
            </span>
          </h2>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Dive into your creative universe where ideas flow seamlessly and
            collaboration becomes pure magic ✨
          </p>
        </div>

        {/* Ultra Stunning Actions Bar */}
        <div
          className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-20 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/25 via-pink-300/25 to-blue-300/25 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-500" />
              </div>
              <Input
                placeholder="Discover your masterpieces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-16 h-16 bg-white/70 backdrop-blur-sm border-2 border-slate-300/40 text-slate-800 placeholder:text-slate-500 focus:border-purple-400/50 focus:ring-4 focus:ring-purple-500/20 rounded-2xl text-lg font-normal"
              />
            </div>
          </div>

          {/* Ultra Stunning Create Button */}
          <Button
            onClick={createDocument}
            disabled={isCreating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-16 px-10 text-white font-semibold rounded-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-purple-500/25 text-lg relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex items-center space-x-4 relative z-10">
              {isCreating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Magic...</span>
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6" />
                  <span>Create Document</span>
                  <Zap className="h-5 w-5 opacity-80" />
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Ultra Modern Documents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="bg-white/80 backdrop-blur-sm border border-slate-300/40 rounded-2xl shadow-lg animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-pink-200/15 to-blue-200/20"></div>
                <CardHeader className="space-y-4">
                  <div className="h-8 bg-slate-300/50 rounded-xl w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-slate-300/50 rounded-xl w-1/2 animate-pulse"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-6 bg-slate-300/50 rounded-xl w-full mb-4 animate-pulse"></div>
                  <div className="h-6 bg-slate-300/50 rounded-xl w-2/3 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-24 animate-scale-in">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-300/30 via-pink-300/30 to-blue-300/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                <FileText className="h-16 w-16 text-primary" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300/15 via-pink-300/15 to-blue-300/15 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <h3 className="text-4xl font-bold text-slate-800 mb-6">
              {searchTerm ? "No documents found" : "Your Canvas Awaits"}
            </h3>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {searchTerm
                ? "Try adjusting your search or create something completely new"
                : "Every masterpiece starts with a single word. Begin your creative journey now."}
            </p>
            {!searchTerm && (
              <Button
                onClick={createDocument}
                disabled={isCreating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12 py-6 text-xl font-semibold rounded-2xl hover:scale-105 shadow-2xl shadow-purple-500/25 relative overflow-hidden group transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex items-center space-x-4 relative z-10">
                  <Plus className="h-6 w-6" />
                  <span>Create Your First Masterpiece</span>
                  <Sparkles className="h-5 w-5 opacity-80" />
                </div>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDocuments.map((doc, index) => (
              <Card
                key={doc.id}
                className="bg-white/80 backdrop-blur-sm border border-slate-300/40 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 group relative overflow-hidden animate-scale-in transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Stunning gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-pink-200/15 to-blue-200/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-300/25 via-pink-300/25 to-blue-300/25 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                <CardHeader className="relative z-10 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-success to-accent rounded-full animate-pulse shadow-lg shadow-success/50" />
                        <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">
                          Ready to Edit
                        </span>
                      </div>
                      <CardTitle className="text-xl font-semibold text-slate-800 truncate mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {doc.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-slate-600 space-x-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Updated {formatDate(doc.updated_at)}</span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-200/30 rounded-xl"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/90 backdrop-blur-xl border-slate-300/50 shadow-xl"
                      >
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer font-medium"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Forever
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <Link
                    to={`/doc/${doc.id}`}
                    className="block p-6 -mx-6 -mb-6 rounded-2xl hover:bg-purple-100/40 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-purple-200/20 group-hover:to-pink-200/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-700 font-medium group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        <FileText className="h-6 w-6 mr-4" />
                        <span className="text-lg">Open Document</span>
                      </div>
                      <Globe className="h-5 w-5 text-slate-500 group-hover:text-purple-600 transition-all duration-300" />
                    </div>
                  </Link>
                </CardContent>

                {/* Ultra Modern decorative elements */}
                <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-purple-300/15 via-pink-300/15 to-blue-300/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </Card>
            ))}
          </div>
        )}

        {/* Ultra Stunning Stats Section */}
        {!isLoading && filteredDocuments.length > 0 && (
          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-white/80 backdrop-blur-sm border border-slate-300/40 rounded-2xl shadow-lg hover:shadow-xl p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-pink-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {documents.length}
                </div>
                <div className="text-sm text-slate-600 font-medium uppercase tracking-wider">
                  Total Creations
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-300/40 rounded-2xl shadow-lg hover:shadow-xl p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-purple-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-300/30 to-purple-300/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-success" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Active
                </div>
                <div className="text-sm text-slate-600 font-medium uppercase tracking-wider">
                  Collaboration Mode
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-300/40 rounded-2xl shadow-lg hover:shadow-xl p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-blue-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-300/30 to-blue-300/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Premium
                </div>
                <div className="text-sm text-slate-600 font-medium uppercase tracking-wider">
                  Editor Experience
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
