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
)

app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/friends', friendRouter);
app.use('/api/messages', messagesRouter)

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);