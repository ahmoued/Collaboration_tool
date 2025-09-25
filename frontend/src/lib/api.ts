// API configuration - replace with your deployed backend URL
// Options:
// 1. For local development: 'http://localhost:3000' (or your local port)
// 2. For deployed backend: 'https://your-backend-domain.com'
// 3. For now, using a mock URL - replace with your actual backend
const API_BASE_URL = 'http://localhost:3000'; // Update this to your backend URL

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Something went wrong' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Auth endpoints
  async signup(username: string, email: string, password: string) {
    return this.request('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  // Document endpoints
  async getDocuments() {
    return this.request('/documents');
  }

  async createDocument(title: string) {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async getDocument(id: string) {
    return this.request(`/documents/${id}`);
  }

  async updateDocument(id: string, title: string) {
    return this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async shareDocument(id: string, targetUserId: string, role: string) {
    return this.request(`/documents/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ targetUserId, role }),
    });
  }

  // Block endpoints
  async createBlock(documentId: string, type: string, content: any, position: number) {
    return this.request('/blocks', {
      method: 'POST',
      body: JSON.stringify({ documentId, type, content, position }),
    });
  }

  async getBlocks(documentId: string) {
    return this.request(`/blocks/${documentId}`);
  }

  async updateBlock(blockId: string, type?: string, content?: any, position?: number) {
    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (content !== undefined) updateData.content = content;
    if (position !== undefined) updateData.position = position;

    return this.request(`/blocks/${blockId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteBlock(blockId: string) {
    return this.request(`/blocks/${blockId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Types for the API responses
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Document {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  document_id: string;
  type: string;
  content: any;
  position: number;
  created_at: string;
  updated_at: string;
}