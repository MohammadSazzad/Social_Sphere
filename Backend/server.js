import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './route/users.js';
import eventsRouter from './route/events.js';
import storiesRouter from './route/stories.js';
import postsRouter from './route/posts.js';
import friendRouter from './route/friends.js';
import cookieParser from 'cookie-parser';
import messagesRouter from './route/messages.js';
import cors from 'cors';
import multer from 'multer';
// import profileRouter from './route/profile.js'; 

import { app, server, injectSocketIO } from './config/socket.js';


dotenv.config();

const PORT = process.env.SERVER_PORT;

app.use(injectSocketIO);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/friends', friendRouter);
app.use('/api/messages', messagesRouter);
// app.use('/api/profile', profileRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer errors (file too large, etc)
    return res.status(400).json({
      error: err.message || 'File upload error'
    });
  } else if (err) {
    // Generic errors
    console.error('Unhandled error:', err);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
  next();
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
