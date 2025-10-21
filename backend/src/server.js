import 'dotenv/config'
import express from 'express'
import cors from 'cors';
import { connectionPool } from './config/connectionPool.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import profileRouter from './routes/profile.routes.js';
import authRoutes from './routes/auth.routes.js';

// Instance app and initialize the connection to the database
const app = express();
connectionPool();

// Usages
app.use(express.json())
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/profiles', profileRouter)


export default app;