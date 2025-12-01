const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, 'users.json');
const JWT_SECRET = 'demo-secret-key';

// Helper: read users from JSON file
function readUsers() {
  if (!fs.existsSync(usersFile)) {
    return {};
  }
  const data = fs.readFileSync(usersFile, 'utf-8');
  return JSON.parse(data || '{}');
}

// Helper: write users to JSON file
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const users = readUsers();

  if (users[username]) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // Simple: store plaintext for demo (NOT production-safe)
  users[username] = { password };
  writeUsers(users);

  return res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const users = readUsers();
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });

  return res.json({ message: 'Login successful', token });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
