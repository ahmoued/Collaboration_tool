# Collaboration Tool

A real-time collaborative document editor with user authentication, role-based access control, and persistent storage.

## 🎯 Project Goal

Provide a robust real-time collaborative editing experience with:
- User account management and authentication
- Document sharing with granular role permissions
- Real-time synchronization powered by Y.js CRDT
- Persistent storage with PostgreSQL

## 🏗️ Project Structure

```
.
├── backend/                 # Node.js/TypeScript API & Y.js server
│   ├── src/                # Express app, routes, middleware
│   │   ├── routes/         # Auth, users, documents endpoints
│   │   ├── middleware/     # Authentication & authorization
│   │   └── db/             # Database connection & queries
│   ├── yjs-server.cjs      # Y.js WebSocket server for real-time collaboration
│   ├── tests/              # Integration & unit tests
│   ├── Dockerfile          # Multi-stage Docker build
│   └── package.json
│
├── frontend/               # Vite + React UI
│   ├── src/
│   │   ├── pages/          # Application pages
│   │   ├── components/     # React components
│   │   │   ├── CollaborationManager.jsx
│   │   │   └── Editor.jsx
│   │   └── styles/         # CSS/styling
│   └── .env                # Environment variables
│
├── kubernetes/             # K8s deployment manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── postgres-deployment.yaml
│   ├── secrets.yaml
│   └── services.yaml
│
├── .github/
│   └── workflows/
│       └── cicd.yml        # GitHub Actions pipeline
│
└── docker-compose.yml      # Local development orchestration
```

## ✨ Key Features

- **Authentication System**: Secure signup/login with JWT tokens
- **Document Management**: Create, read, update, and delete documents
- **Sharing & Permissions**: Share documents with role-based access (owner, editor, viewer)
- **Real-time Collaboration**: Powered by Y.js CRDT with dedicated WebSocket server
- **PostgreSQL Database**: Reliable persistence with comprehensive integration tests
- **Containerization**: Multi-stage Docker builds for optimized production images
- **CI/CD Pipeline**: Automated build, test, and deployment via GitHub Actions
- **Kubernetes Ready**: Production-grade deployment manifests included

## 🚀 Quick Start (Local Development)

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (if running outside Docker)

### Environment Setup

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@postgres:5432/collaboration_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Start Services

```bash
# Start all services (backend, frontend, database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:4000
- **Y.js WebSocket**: ws://localhost:1234

## 🧪 Running Tests

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run integration tests
npm test
```

## 🐳 Docker Images

### Build Images Manually

```bash
# Build backend image
docker build -t collaboration-tool-backend:latest ./backend

# Build frontend image
docker build -t collaboration-tool-frontend:latest ./frontend

# Push to GitHub Container Registry
docker tag collaboration-tool-backend:latest ghcr.io/YOUR_USERNAME/collaboration-tool-backend:latest
docker push ghcr.io/YOUR_USERNAME/collaboration-tool-backend:latest
```

### CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Builds development and test images
2. Runs integration tests
3. Builds production-optimized images
4. Pushes images to GitHub Container Registry (GHCR)

## ☸️ Kubernetes Deployment

### 1. Create Image Pull Secret (for private images)

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL
```

### 2. Apply Kubernetes Manifests

```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods
kubectl get services
```

### 3. Update Deployments

After pushing new images:

```bash
# Force pull latest images
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend

# Monitor rollout status
kubectl rollout status deployment/backend
```

### 4. Debugging

```bash
# View pod logs
kubectl logs -f deployment/backend

# Describe pod for events
kubectl describe pod POD_NAME

# Execute commands in pod
kubectl exec -it POD_NAME -- /bin/sh
```

## 🔧 Configuration Notes

### Frontend Environment Variables

**For in-cluster communication:**
```env
VITE_API_URL=http://backend:4000
```

**For local development or external access:**
```env
VITE_API_URL=http://localhost:4000
```

**For production with ingress:**
```env
VITE_API_URL=https://api.yourdomain.com
```

### Database Configuration

For production deployments, use Kubernetes secrets instead of `.env` files:

```bash
kubectl create secret generic db-credentials \
  --from-literal=username=dbuser \
  --from-literal=password=securepassword
```

## 🌟 What Makes This Unique

- **Integrated Y.js Server**: Dedicated WebSocket server alongside the backend provides robust CRDT-based collaborative editing with conflict-free synchronization
- **End-to-End DevOps**: Complete workflow from local development with Docker Compose, through automated CI/CD with GitHub Actions, to production deployment with Kubernetes
- **Separation of Concerns**: Multi-stage Dockerfiles ensure development dependencies stay out of production images, reducing image size and attack surface
- **Comprehensive Testing**: Integration tests validate API endpoints and database interactions before deployment


