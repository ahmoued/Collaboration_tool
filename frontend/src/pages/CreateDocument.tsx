import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { FileText, ArrowLeft } from "lucide-react";

const NewDocumentPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your document.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const payload: { title: string; content?: any } = {
        title: title.trim(),
      };

      // Only include content if it's not empty
      if (content.trim()) {
        payload.content = {
          type: "doc",
          content: [
            {
            type: "paragraph",
            content: [{ type: "text", text: content.trim() }],
            },
          ],
        };
      }
      console.log('content format set')

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/docs`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('backend request sent')

      toast({
        title: "Document created!",
        description: "Your new document is ready to edit.",
      });

      // Navigate to the created document
      navigate(`/doc/${response.data.id}`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      toast({
        title: "Error creating document my bro",
        description: err.response?.data?.error || err.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-100 to-slate-200">
      {/* Header */}
      <header className="border-b border-slate-300/50 bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 hover:bg-purple-200/30 transition-all duration-300 rounded-xl px-3 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-slate-800">
                Create New Document
              </h1>
            </div>
            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-2xl shadow-purple-500/10 bg-white/90 backdrop-blur-sm border border-slate-300/40">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-slate-800">
              New Document
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Create a new document to start collaborating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Title - Required */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-700"
                >
                  Document Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="h-11 border-slate-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white/80"
                  required
                  disabled={isCreating}
                />
              </div>

              {/* Document Content - Optional */}
              <div className="space-y-2">
                <Label
                  htmlFor="content"
                  className="text-sm font-medium text-slate-700"
                >
                  Content (Optional)
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter initial document content..."
                  className="min-h-[100px] resize-none border-slate-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors bg-white/80"
                  disabled={isCreating}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isCreating || !title.trim()}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating Document...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Document
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewDocumentPage;
