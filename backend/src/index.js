import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectionPool } from './config/connectionPool.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import profileRouter from './routes/profile.routes.js';
import authRoutes from './routes/auth.routes.js';
import friendshipRouter from './routes/friendship.routes.js';
import achievementRouter from './routes/achievement.routes.js';

// [Instances]
const app = express();
connectionPool();

// [Middlwares]
app.use(express.json());
app.use(cors());

// [Routes]
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/friendships', friendshipRouter);
app.use('/api/achievements', achievementRouter);

// [Server]
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log('Servidor Corriendo:')
});