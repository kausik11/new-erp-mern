# Project Management Dashboard - Frontend

A modern, responsive React-based project management dashboard that integrates with a Node.js/MongoDB backend. Features role-based access control, comprehensive CRUD operations, and real-time task management.

## 🚀 Features

- **Authentication System** - Login and registration with JWT token management
- **Role-Based Access Control** - Admin, Manager, and Employee roles with permission-based UI
- **Client Management** - Create, read, update, and delete client information
- **Project Management** - Manage projects with status tracking and client assignment
- **Task Management** - Create and assign tasks with priority and status tracking
- **File Uploads** - Attach files to projects (integrated with Multer backend)
- **Dark/Light Theme** - Theme toggle with localStorage persistence
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Error Handling** - Comprehensive error states with user-friendly messages
- **Loading States** - Visual feedback during API operations
- **Empty States** - Clear messaging when no data is available

## 📋 Prerequisites

- Node.js 16+ and npm/pnpm
- Backend server running on `http://localhost:5000`
- Backend `.env` file configured with:
  - MongoDB connection URI
  - JWT secrets
  - Token expiration times

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <repository-url>
cd frontend
npm install
# or
pnpm install
\`\`\`

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

\`\`\`env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Client Configuration
NEXT_PUBLIC_APP_NAME=Project Management
\`\`\`

### 3. Start Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

\`\`\`
frontend/
├── app/
│   ├── layout.tsx                 # Root layout with theme provider
│   ├── globals.css                # Global styles and theme variables
│   ├── page.tsx                   # Home redirect to login
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   └── dashboard/
│       ├── layout.tsx             # Dashboard layout with sidebar
│       ├── page.tsx               # Dashboard home
│       ├── clients/               # Client management pages
│       ├── projects/              # Project management pages
│       └── tasks/                 # Task management pages
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── sidebar.tsx                # Navigation sidebar
│   ├── protected-route.tsx        # Route protection wrapper
│   ├── theme-toggle.tsx           # Dark/light mode toggle
│   ├── file-upload.tsx            # File upload component
│   ├── delete-confirm-dialog.tsx  # Reusable delete confirmation
│   ├── clients/                   # Client components
│   ├── projects/                  # Project components
│   └── tasks/                     # Task components
├── lib/
│   ├── api-client.ts              # Axios instance with JWT interceptors
│   ├── auth-context.tsx           # Authentication context and provider
│   └── hooks.ts                   # Custom API hooks
├── .env.local                     # Environment configuration
└── package.json                   # Dependencies and scripts
\`\`\`

## 🔐 Authentication Flow

1. **Registration** - New users create an account with email/password
2. **Login** - Users authenticate and receive JWT tokens
3. **Token Storage** - Tokens stored in localStorage for persistence
4. **Token Refresh** - Automatic token refresh on 401 responses
5. **Logout** - Clear tokens and redirect to login

### API Endpoints

**Auth Routes** (`/api/auth`):
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /logout` - User logout

## 📊 API Integration

### Clients Module

**Endpoints** (`/api/clients`):
- `GET /` - List all clients (protected)
- `POST /` - Create client (Admin/Manager only)
- `GET /:id` - Get client details (protected)
- `PUT /:id` - Update client (Admin/Manager only)
- `DELETE /:id` - Delete client (Admin/Manager only)

### Projects Module

**Endpoints** (`/api/projects`):
- `GET /` - List projects (protected)
- `POST /` - Create project (Admin/Manager + permission)
- `GET /:id` - Get project details (protected)
- `PUT /:id` - Update project (Admin/Manager only)
- `DELETE /:id` - Delete project (Admin/Manager only)
- `POST /:id/attachments` - Upload file attachment (protected)

### Tasks Module

**Endpoints** (`/api/projects/:projectId/tasks`):
- `GET /` - List tasks for project (protected)
- `POST /` - Create task (Admin/Manager + permission)
- `GET /:id` - Get task details (protected)
- `PUT /:id` - Update task (Admin/Manager only)
- `DELETE /:id` - Delete task (Admin/Manager only)

### Users Module

**Endpoints** (`/api/users`):
- `GET /` - List users (Admin/Manager only)
- `POST /` - Create user (Admin only)
- `GET /:id` - Get user details (Admin/Manager only)
- `PUT /:id` - Update user (Admin only)
- `DELETE /:id` - Delete user (Admin only)
- `PATCH /:id/grant` - Grant permissions (Admin/Manager only)
- `PATCH /:id/revoke` - Revoke permissions (Admin/Manager only)

## 🔑 Role-Based Access Control

### Admin Role
- Full access to all modules
- Can create, edit, delete clients, projects, and tasks
- Can manage users and permissions
- Can view all data

### Manager Role
- Can manage projects and tasks
- Can create and manage clients
- Limited user management within their scope
- Cannot delete other managers' data

### Employee Role
- Can view assigned projects and tasks
- Can update task status
- Limited read access to clients
- Cannot create or delete resources

## 🎨 Theme System

The application includes a comprehensive dark/light theme system using CSS variables:

- **Default Theme**: System preference detection
- **Theme Toggle**: Located in the sidebar header
- **Persistence**: Theme preference saved in localStorage
- **Custom Colors**: All colors defined via CSS custom properties

### Theme Variables

\`\`\`css
--primary: Primary brand color
--secondary: Secondary accent color
--accent: Interactive accent color
--background: Page background
--foreground: Text color
--muted: Muted elements
--destructive: Error/delete actions
--border: Border colors
\`\`\`

## ⚠️ Error Handling

The application handles various error scenarios:

- **Network Errors** - Display connection failure messages
- **Authentication Errors** - Auto-logout on token expiration
- **Validation Errors** - Show specific field validation messages
- **API Errors** - Display backend error messages to user
- **Loading States** - Show spinners during API calls
- **Empty States** - Helpful messaging when no data exists

## 📱 Responsive Design

- **Mobile**: Full-featured on small screens with collapsible sidebar
- **Tablet**: Optimized layout for medium screens
- **Desktop**: Full navigation and multi-column layouts
- **Touch-Friendly**: Larger clickable areas on mobile

## 🔄 State Management

- **Auth Context** - Manages user authentication state
- **Local Component State** - Form data and UI state
- **localStorage** - Persists tokens and theme preference
- **API Client** - Centralized HTTP requests with interceptors

## 📦 Dependencies

- **React 19+** - UI framework
- **Next.js 16+** - React framework with routing
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - UI component library
- **Axios** - HTTP client
- **Lucide Icons** - Icon library
- **React Hook Form** - Form management (can be extended)

## 🚀 Build & Deployment

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run start
\`\`\`

### Deployment to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

## 🔗 Backend Integration

Ensure your backend is running and accessible:

\`\`\`bash
# Backend should be running on:
http://localhost:5000

# Update NEXT_PUBLIC_API_URL if backend runs on different port
\`\`\`

## 🛠️ Development Tips

1. **Local Storage Keys** - `accessToken`, `refreshToken`, `user`, `theme`
2. **JWT Format** - Tokens included in `Authorization: Bearer <token>` header
3. **Error Responses** - Backend should return errors in format: `{ message: "Error text" }`
4. **CORS** - Backend should allow requests from `http://localhost:3000`

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

Please follow the existing code structure and styling conventions when contributing.
