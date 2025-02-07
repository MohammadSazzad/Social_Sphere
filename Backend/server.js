import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './route/users.js';

dotenv.config();

const PORT = process.env.SERVER_PORT;

const app = express();

app.use(express.json());
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);