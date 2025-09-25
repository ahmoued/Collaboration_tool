import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Document } from "@/lib/api";
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
    setIsCreating(true);
    /*try{
      const token = await localStorage.getItem("token")
      if (!token) throw new Error('could not do that, didnt get your token')
      const result = await axios.post("http://localhost:4000", 
      {title: })
    }*/

    // Mock document creation
    const newDoc: Document = {
      id: String(Date.now()),
      title: "Untitled Document",
      owner_id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...(prev || [])]);
    toast({
      title: "Document created!",
      description: "Your new document is ready to edit.",
    });
    navigate(`/document/${newDoc.id}`);
    setIsCreating(false);
  };

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Edit3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                CollabEditor
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.username || "Loading..."}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.username || "User"}
          </h2>
          <p className="text-muted-foreground">
            Continue working on your documents or create a new one to get
            started.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            onClick={createDocument}
            disabled={isCreating}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{isCreating ? "Creating..." : "New Document"}</span>
          </Button>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? "No documents found" : "No documents yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first document to get started"}
            </p>
            {!searchTerm && (
              <Button onClick={createDocument} disabled={isCreating}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first document
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-medium text-foreground truncate mb-1">
                        {doc.title}
                      </CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {formatDate(doc.updated_at)}</span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Link
                    to={`/doc/${doc.id}`}
                    className="block p-3 -mx-3 -mb-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center text-sm text-primary font-medium">
                      <FileText className="h-4 w-4 mr-2" />
                      Open document
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
