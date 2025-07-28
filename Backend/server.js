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

// —— compute __dirname under ES modules ——
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// —— middleware & body parsers ——
app.use(injectSocketIO);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// —— CORS (adjust origin in prod!) ——
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// —— API routes ——
app.use('/api/users',   usersRouter);
app.use('/api/events',  eventsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/posts',   postsRouter);
app.use('/api/friends', friendRouter);
app.use('/api/messages',messagesRouter);

// —— serve client build ——
const clientBuildPath = path.join(__dirname, 'public');
app.use(express.static(clientBuildPath));

// anything not starting with /api goes to index.html
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// —— error handler for Multer and generic errors ——
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
});

// —— start server ——
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
