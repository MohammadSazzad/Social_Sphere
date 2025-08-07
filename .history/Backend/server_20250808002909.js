// Backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import usersRouter from './route/users.js';
import eventsRouter from './route/events.js';
import storiesRouter from './route/stories.js';
import postsRouter from './route/posts.js';
import friendRouter from './route/friends.js';
import messagesRouter from './route/messages.js';
import p

import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';

import { app, server, injectSocketIO } from './config/socket.js';

dotenv.config();

// Development configuration
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  console.log('🔧 Running in DEVELOPMENT mode');
  console.log('📝 Enhanced logging and debugging enabled');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(injectSocketIO);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Development middleware for request logging
if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', req.body);
    }
    next();
  });
}

app.use(
  cors({
    origin: isDevelopment 
      ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
      : process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// —— API routes ——
app.use('/api/users',   usersRouter);
app.use('/api/events',  eventsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/posts',   postsRouter);
app.use('/api/friends', friendRouter);
app.use('/api/messages',messagesRouter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, 'public');
  app.use(express.static(clientBuildPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}


const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error('🚨 Error details:', {
    message: err.message,
    stack: isDevelopment ? err.stack : 'Stack trace hidden in production',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      error: err.message,
      type: 'MulterError',
      ...(isDevelopment && { details: err })
    });
  } else if (err) {
    return res.status(500).json({ 
      error: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { 
        stack: err.stack,
        type: err.constructor.name
      })
    });
  }
  next();
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log('\n🚀 Social Sphere Backend Server Started!');
  console.log('================================');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${isDevelopment ? 'Development origins (localhost:5173, localhost:3000)' : 'Production origin'}`);
  console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`🔧 Development features: ${isDevelopment ? 'ENABLED' : 'DISABLED'}`);
  console.log('================================\n');
  
  if (isDevelopment) {
    console.log('💡 Development Tips:');
    console.log('   - API endpoints: http://localhost:3000/api');
    console.log('   - Socket.IO: http://localhost:3000');
    console.log('   - Uploads: http://localhost:3000/uploads');
    console.log('   - Enhanced error details enabled');
    console.log('   - Request logging enabled\n');
  }
})
