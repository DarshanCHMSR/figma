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

- Real-time chat interface matching the provided design
- Message history with timestamps
- User avatars with initials
- Responsive design for mobile devices
- SQLite database for message persistence
- REST API for message operations

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

- `GET /api/groups/:groupId` - Get group information
- `GET /api/groups/:groupId/messages` - Get all messages for a group
- `POST /api/groups/:groupId/messages` - Send a new message
- `GET /api/groups` - Get all groups

## Technologies Used

### Frontend
- React 18
- Vite
- Lucide React (for icons)
- Axios (for API calls)
- CSS3 with Flexbox

### Backend
- Node.js
- Express.js
- SQLite3
- CORS
- Nodemon (for development)

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. The chat interface will load with sample messages
4. Type a message and press Enter or click the Send button
5. Messages are saved to the SQLite database

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