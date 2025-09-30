import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT;

connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(PORT, () => console.log(`Puerto ${PORT}`));
    })
    .catch((err) => {
        console.error('Error conectando a MongoDB:', err.message);
    });
