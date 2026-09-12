require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/route');
const errno = require('./errnoMiddleware/errno');

const app = express();


app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env file');
  process.exit(1);
}


mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});


app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'API is running', version: '1.0.0', port: PORT });
});

// Routes
app.use('/', userRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({ error: 'Route not found' });
});

app.use(errno);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
});
