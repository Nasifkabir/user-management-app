const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

const mysql = require('mysql2');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root', // Your MySQL username
   password: 'Jubian.34', // Your MySQL password
   database: 'user_management' // Database name
});

db.connect((err) => {
   if (err) {
      console.error('Error connecting to the database:', err);
   } else {
      console.log('Connected to MySQL database');
   }
});

const bcrypt = require('bcryptjs');

app.post('/register', async (req, res) => {
   const { name, email, password } = req.body;

   // Check if user already exists
   db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (result.length > 0) {
         return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Insert new user
      db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [name, email, hashedPassword], (err, result) => {
         if (err) return res.status(500).json({ message: 'Error registering user' });
         res.status(201).json({ message: 'User registered successfully' });
      });
   });
});

const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
   const { email, password } = req.body;

   // Check if user exists
   db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (result.length === 0) {
         return res.status(400).json({ message: 'User not found' });
      }

      const user = result[0];

      // Check if user is blocked
      if (user.status === 'blocked') {
         return res.status(403).json({ message: 'User is blocked' });
      }

      // Compare password
      if (!bcrypt.compareSync(password, user.password)) {
         return res.status(401).json({ message: 'Incorrect password' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

      // Update last login time
      db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      res.json({ token, message: 'Login successful' });
   });
});

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Access denied' });
 
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
       if (err) return res.status(403).json({ message: 'Invalid token' });
       req.user = user;
       next();
    });
 };

app.get('/users', authenticateJWT, (req, res) => {
    db.query('SELECT id, name, email, last_login, registration_time, status FROM users', (err, results) => {
       if (err) return res.status(500).json({ message: 'Error fetching users' });
       res.json(results);
    });
 });

 app.patch('/users/block', authenticateJWT, (req, res) => {
    const { userIds } = req.body;
 
    db.query('UPDATE users SET status = "blocked" WHERE id IN (?)', [userIds], (err) => {
       if (err) return res.status(500).json({ message: 'Error blocking users' });
       res.json({ message: 'Users blocked' });
    });
 });

 app.patch('/users/unblock', authenticateJWT, (req, res) => {
    const { userIds } = req.body;
 
    db.query('UPDATE users SET status = "active" WHERE id IN (?)', [userIds], (err) => {
       if (err) return res.status(500).json({ message: 'Error unblocking users' });
       res.json({ message: 'Users unblocked' });
    });
 });

 app.delete('/users/delete', authenticateJWT, (req, res) => {
    const { userIds } = req.body;
 
    db.query('DELETE FROM users WHERE id IN (?)', [userIds], (err) => {
       if (err) return res.status(500).json({ message: 'Error deleting users' });
       res.json({ message: 'Users deleted' });
    });
 });
  