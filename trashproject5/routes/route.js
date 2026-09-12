const express = require('express');
const router = express.Router();

// Placeholder user routes
router.get('/users', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'Users endpoint - GET all users' });
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: `Get user with ID: ${id}` });
});

router.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({ 
    message: 'User created successfully',
    user: { name, email }
  });
});

router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: `User with ID ${id} updated` });
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: `User with ID ${id} deleted` });
});

module.exports = router;
