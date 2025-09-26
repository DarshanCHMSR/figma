# Chat Application

This is a chat application built with React (Vite) frontend and Node.js/Express backend with SQLite database.

## Project Structure

```
figma/
├── frontend/                          # React Frontend Application
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── ChatInterface.jsx     # Main chat UI component
│   │   │   ├── ChatInterface.css     # Chat styling
│   │   │   ├── Login.jsx            # Login form component
│   │   │   ├── Signup.jsx           # Registration form
│   │   │   ├── Auth.css             # Authentication styling
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # Global app styles
│   │   ├── index.css                # Root styles
│   │   └── main.jsx                 # App entry point
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js              # Vite configuration
├── backend/                         # Node.js Backend Server
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── server.js                    # Express server and API routes
│   ├── package.json                 # Backend dependencies
│   └── chat.db                      # SQLite database (auto-created)
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

## Features

- **User Authentication**: Complete login/signup system with JWT tokens
- **Real-time Chat**: Interactive chat interface matching the provided design
- **User Management**: User profiles with avatars and session management
- **Message History**: Persistent message storage with timestamps
- **Responsive Design**: Mobile-first design that works on all devices
- **Secure API**: Protected routes with proper authentication
- **Loading States**: Smooth loading animations and user feedback

## Setup and Installation

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account
```json
// Request Body
{
  "username": "string (min 3 chars)",
  "email": "valid-email@domain.com", 
  "password": "string (min 6 chars)"
}

// Response (201)
{
  "token": "jwt-token-string",
  "user": {
    "id": 1,
    "username": "username",
    "email": "email@domain.com"
  }
}
```

#### POST `/api/auth/login`
Login existing user
```json
// Request Body
{
  "email": "user@domain.com",
  "password": "userpassword"
}

// Response (200)
{
  "token": "jwt-token-string",
  "user": {
    "id": 1,
    "username": "username", 
    "email": "email@domain.com"
  }
}
```

#### GET `/api/auth/me` 🔒
Get current authenticated user info
```json
// Headers: Authorization: Bearer <jwt-token>
// Response (200)
{
  "id": 1,
  "username": "username",
  "email": "email@domain.com"
}
```

### Chat Endpoints

#### GET `/api/groups/:groupId/messages`
Get all messages for a specific group
```json
// Response (200)
[
  {
    "id": 1,
    "group_id": 1,
    "user_id": 1,
    "username": "sender",
    "message": "Hello world!",
    "timestamp": "2025-09-27T10:30:00.000Z"
  }
]
```

#### POST `/api/groups/:groupId/messages` 🔒
Send a new message to a group
```json
// Headers: Authorization: Bearer <jwt-token>
// Request Body
{
  "message": "Your message content"
}

// Response (201)
{
  "id": 5,
  "group_id": 1,
  "user_id": 1,
  "username": "sender",
  "message": "Your message content",
  "timestamp": "2025-09-27T10:35:00.000Z"
}
```

#### GET `/api/groups/:groupId`
Get group information
```json
// Response (200)
{
  "id": 1,
  "name": "Fun Friday Group",
  "description": "A group for fun discussions",
  "created_at": "2025-09-27T09:00:00.000Z"
}
```

#### GET `/api/groups`
Get all available groups
```json
// Response (200)
[
  {
    "id": 1,
    "name": "Fun Friday Group",
    "description": "A group for fun discussions"
  }
]
```

**Legend**: 🔒 = Protected endpoint (requires JWT token)

## Tech Stack

### Frontend Technologies
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation
- **React Context API** - Global state management for authentication
- **Lucide React** - Beautiful, customizable SVG icons
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with Flexbox, Grid, and animations
- **React Hooks** - useState, useEffect, useContext, useRef

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight, file-based SQL database
- **JWT (jsonwebtoken)** - Secure user authentication tokens
- **bcryptjs** - Password hashing and security
- **express-validator** - Input validation and sanitization
- **CORS** - Cross-Origin Resource Sharing middleware
- **Nodemon** - Auto-restart development server

### Development Tools
- **npm** - Package manager
- **Git** - Version control
- **VS Code** - Code editor (recommended)
- **PowerShell/Terminal** - Command line interface

### Architecture Patterns
- **RESTful API** - Clean API design with proper HTTP methods
- **JWT Authentication** - Stateless authentication system
- **Component-Based Architecture** - Reusable React components
- **Context Pattern** - Centralized state management
- **Protected Routes** - Route-level authentication guards
- **Responsive Design** - Mobile-first CSS approach

## Application Status: ✅ WORKING

This chat application is fully functional with complete authentication and real-time messaging capabilities.

## Usage

### Quick Start
1. **Start Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start Frontend Server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Open Application**: Navigate to `http://localhost:5173`

### User Flow
1. **Registration**: Create account with username, email, and password (6+ characters)
2. **Authentication**: Secure login with JWT tokens
3. **Chat Interface**: Real-time messaging with responsive UI
4. **User Management**: Profile menu with logout functionality
5. **Message Persistence**: All messages saved to SQLite database

### Features Currently Working ✅
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes and API endpoints
- ✅ Real-time chat interface
- ✅ Message persistence in database
- ✅ Responsive mobile design
- ✅ User avatars with initials
- ✅ Loading states and error handling
- ✅ Auto-scroll to new messages
- ✅ Logout functionality

## Database Schema (SQLite)

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,              -- bcrypt hashed
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Groups Table  
```sql
CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    user_id INTEGER,
    username TEXT,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Key Features Implemented

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based auth system
- **Password Hashing** - bcrypt for secure password storage
- **Protected Routes** - Frontend and backend route protection
- **Input Validation** - Server-side validation with express-validator
- **CORS Configuration** - Secure cross-origin requests

### 💬 Chat Functionality
- **Real-time Messaging** - Instant message display and sending
- **Message Persistence** - All messages saved to SQLite database
- **User Attribution** - Messages linked to authenticated users
- **Auto-scroll** - Automatic scroll to latest messages
- **Loading States** - Visual feedback during operations

### 🎨 User Interface
- **Mobile-First Design** - Responsive layout for all screen sizes
- **Modern UI Components** - Clean, intuitive interface design
- **User Avatars** - Generated avatars with user initials
- **Loading Animations** - Smooth loading spinners and transitions
- **Error Handling** - User-friendly error messages

### 🏗️ Architecture
- **Component-Based** - Modular React component structure
- **Context API** - Global state management for authentication
- **RESTful API** - Clean API design with proper HTTP methods
- **Database Relations** - Proper foreign key relationships
- **Code Organization** - Separation of concerns and clean code

## Troubleshooting

### Common Issues & Solutions

#### 1. Server Won't Start
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill processes if needed
taskkill /F /PID <process-id>
```

#### 2. Database Issues
```bash
# Delete and recreate database
cd backend
rm chat.db
npm run dev  # Will recreate database with fresh schema
```

#### 3. Frontend Build Issues  
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### 4. Authentication Errors
- Ensure backend server is running on port 5000
- Check browser network tab for API errors
- Verify JWT token is being sent in requests

### Development Tips
- Use browser DevTools to debug frontend issues
- Check backend terminal for server error logs
- Use database browser to inspect SQLite data
- Test API endpoints with Postman or curl

## Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- **Fast Startup** - Vite dev server with hot reload
- **Lightweight Database** - SQLite for minimal overhead
- **Optimized Bundles** - Vite production builds
- **Efficient Rendering** - React hooks and context optimization