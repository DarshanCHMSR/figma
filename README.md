# Chat Application

This is a chat application built with React (Vite) frontend and Node.js/Express backend with SQLite database.

## Project Structure

```
.
├── frontend/          # React frontend with Vite
├── backend/           # Node.js backend with Express and SQLite
└── README.md
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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (protected)

### Chat
- `GET /api/groups/:groupId` - Get group information
- `GET /api/groups/:groupId/messages` - Get all messages for a group
- `POST /api/groups/:groupId/messages` - Send a new message (protected)
- `GET /api/groups` - Get all groups

## Technologies Used

### Frontend
- React 18
- Vite
- React Router DOM (for navigation)
- React Context API (for state management)
- Lucide React (for icons)
- Axios (for API calls)
- CSS3 with Flexbox and animations

### Backend
- Node.js
- Express.js
- SQLite3 (database)
- JWT (authentication)
- bcryptjs (password hashing)
- express-validator (input validation)
- CORS
- Nodemon (for development)

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. **Create an Account**: Click "Sign up" to create a new account
4. **Login**: Use your credentials to log in
5. **Chat**: Start chatting! Messages are saved with your username
6. **Logout**: Click the user icon in the header to access logout option

### First Time Setup
- The app will redirect to login page
- Create an account with username, email, and password
- After registration, you'll be automatically logged in and redirected to chat

## Database Schema

### Groups Table
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- avatar (TEXT)
- created_at (DATETIME)

### Users Table
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- avatar (TEXT)
- created_at (DATETIME)

### Messages Table
- id (INTEGER PRIMARY KEY)
- group_id (INTEGER)
- user_id (INTEGER)
- username (TEXT)
- message (TEXT)
- timestamp (DATETIME)

## Sample Data

The application comes with pre-populated sample data including:
- A "Fun Friday Group" 
- Sample messages from "Anonymous" and "Kirtidan Gadhvi"
- Realistic timestamps

## Mobile Responsiveness

The chat interface is designed to be mobile-first and works well on:
- Desktop browsers
- Mobile devices (iOS/Android)
- Tablets

## Development Notes

- Backend runs on port 5000
- Frontend runs on port 5173
- CORS is enabled for cross-origin requests
- SQLite database file is created automatically
- Sample data is inserted on first run