const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { authMiddleware, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'chat.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Groups table
  db.run(`CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    user_id INTEGER,
    username TEXT,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO groups (id, name, description) VALUES (1, 'Fun Friday Group', 'A group for fun discussions')`);
  
  db.run(`INSERT OR IGNORE INTO users (id, username) VALUES (1, 'Anonymous')`);
  db.run(`INSERT OR IGNORE INTO users (id, username) VALUES (2, 'Kirtidan Gadhvi')`);

  // Insert sample messages
  const sampleMessages = [
    { group_id: 1, user_id: 1, username: 'Anonymous', message: 'Someone order Bornvita!!', timestamp: '2020-08-20 11:35:00' },
    { group_id: 1, user_id: 1, username: 'Anonymous', message: 'hahahahah!!', timestamp: '2020-08-20 11:38:00' },
    { group_id: 1, user_id: 1, username: 'Anonymous', message: "I'm Excited For this Event! Ho-Ho", timestamp: '2020-08-20 11:56:00' },
    { group_id: 1, user_id: 1, username: 'Anonymous', message: 'Hello!', timestamp: '2020-08-20 12:35:00' },
    { group_id: 1, user_id: 1, username: 'Anonymous', message: 'Yessss!!!!!', timestamp: '2020-08-20 12:42:00' },
    { group_id: 1, user_id: 2, username: 'Kirtidan Gadhvi', message: 'We have Surprise For you!!', timestamp: '2020-08-20 13:35:00' }
  ];

  const insertMessage = db.prepare(`INSERT OR IGNORE INTO messages (group_id, user_id, username, message, timestamp) VALUES (?, ?, ?, ?, ?)`);
  sampleMessages.forEach(msg => {
    insertMessage.run(msg.group_id, msg.user_id, msg.username, msg.message, msg.timestamp);
  });
  insertMessage.finalize();
});

// Authentication Routes

// Register new user
app.post('/api/auth/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }

          // Create JWT token
          const payload = {
            user: {
              id: this.lastID,
              username: username,
              email: email
            }
          };

          jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: this.lastID,
                username: username,
                email: email
              }
            });
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  db.get('SELECT id, username, email FROM users WHERE id = ?', [req.user.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(user);
  });
});

// API Routes
// Get all messages for a group
app.get('/api/groups/:groupId/messages', (req, res) => {
  const groupId = req.params.groupId;
  
  db.all(
    `SELECT * FROM messages WHERE group_id = ? ORDER BY timestamp ASC`,
    [groupId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get group info
app.get('/api/groups/:groupId', (req, res) => {
  const groupId = req.params.groupId;
  
  db.get(
    `SELECT * FROM groups WHERE id = ?`,
    [groupId],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    }
  );
});

// Post a new message
app.post('/api/groups/:groupId/messages', authMiddleware, (req, res) => {
  const groupId = req.params.groupId;
  const { message } = req.body;
  const userId = req.user.user.id;
  const username = req.user.user.username;
  
  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }
  
  db.run(
    `INSERT INTO messages (group_id, user_id, username, message) VALUES (?, ?, ?, ?)`,
    [groupId, userId, username, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Return the newly created message
      db.get(
        `SELECT * FROM messages WHERE id = ?`,
        [this.lastID],
        (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(201).json(row);
        }
      );
    }
  );
});

// Get all groups
app.get('/api/groups', (req, res) => {
  db.all(
    `SELECT * FROM groups ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});