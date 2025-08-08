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

import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';

import { app, server, injectSocketIO } from './config/socket.js';

dotenv.config();

// Development configuration
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
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
    if (req.body && Object.keys(req.body).length > 0) {
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

const PORT = process.env.PORT || 3000;

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
  res.status(404).json({ error: 'Route not found' });
});

app.get("/health", (req, res) => res.sendStatus(200));


server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  if (isDevelopment) {
    console.log('   - Enhanced error details enabled');
  }
})
