import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  Search,
  X,
  Crown,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
} from "lucide-react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Collaborator extends User {
  role: "owner" | "editor" | "viewer";
  is_owner: boolean;
}

interface CollaborationManagerProps {
  documentId: string;
  currentUserId: number;
  isOwner: boolean;
}

const CollaborationManager: React.FC<CollaborationManagerProps> = ({
  documentId,
  currentUserId,
  isOwner,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch collaborators
  const fetchCollaborators = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching collaborators for document:", documentId);
      const response = await axios.get(
        `http://${process.env.REACT_APP_BACKEND_HOST}:4000/docs/${documentId}/collaborators`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Collaborators response:", response.data);
      setCollaborators(response.data);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
    }
  };

  // Search users
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${process.env.REACT_APP_BACKEND_HOST}:4000/users/search?username=${encodeURIComponent(
          query
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter out users already collaborating
      const existingUserIds = collaborators.map((c) => c.id);
      const filteredResults = response.data.filter(
        (user: User) => !existingUserIds.includes(user.id)
      );

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add collaborator
  const addCollaborator = async (
    user: User,
    role: "editor" | "viewer" = "editor"
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://${process.env.REACT_APP_BACKEND_HOST}:4000/docs/${documentId}/share`,
        { targetUserId: user.id, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCollaborators();
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error adding collaborator:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove collaborator
  const removeCollaborator = async (userId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://${process.env.REACT_APP_BACKEND_HOST}:4000/documents/${documentId}/collaborators/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCollaborators();
    } catch (error) {
      console.error("Error removing collaborator:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get user initials
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-500";
      case "editor":
        return "bg-green-500";
      case "viewer":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    // Always fetch collaborators when component mounts or documentId changes
    fetchCollaborators();
  }, [documentId]);

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, collaborators]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Collaborators ({collaborators.length})
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md fixed top-32 left-6 z-50 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaborators
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Collaborator (Owner only) */}
        {isOwner && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search users to invite..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={loading}>
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => addCollaborator(user, "editor")}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          As Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => addCollaborator(user, "viewer")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          As Viewer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}

            {isSearching && searchQuery && (
              <p className="text-sm text-gray-500 text-center">Searching...</p>
            )}
          </div>
        )}

        {/* Current Collaborators */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Current Access</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(collaborator.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {collaborator.username}
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs text-white ${getRoleColor(
                          collaborator.role
                        )}`}
                      >
                        {collaborator.role === "owner" && (
                          <Crown className="h-3 w-3 mr-1" />
                        )}
                        {collaborator.role === "editor" && (
                          <Edit className="h-3 w-3 mr-1" />
                        )}
                        {collaborator.role === "viewer" && (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        {collaborator.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Remove button (owner only, can't remove owner) */}
                {isOwner && !collaborator.is_owner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCollaborator(collaborator.id)}
                    disabled={loading}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationManager;
