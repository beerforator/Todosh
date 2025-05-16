// backend/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection } from './db/config';

import { authRouter } from './routes/authRoutes';
import { todoListsRouter } from './routes/todoListRoutes';
import { tasksRouter } from './routes/taskRoutes';
import { authMiddleware } from './middleware/authMiddleware';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const clientURL = process.env.CLIENT_URL

const corsOptions = {
  origin: clientURL || 'http://localhost:3000', // Разрешаем URL фронтенда
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Убедись, что OPTIONS неявно разрешен или явно добавлен
  allowedHeaders: "Content-Type,Authorization", // Разрешаем нужные заголовки
  credentials: true, // Если используешь куки (мы не используем для JWT в заголовке)
  preflightContinue: false,
  optionsSuccessStatus: 204 // Стандартный ответ на OPTIONS preflight
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Подключение роутеров ---
app.use('/api/auth', authRouter); // <-- Подключаем роутер аутентификации

app.use(authMiddleware);

app.use('/api/todolists', todoListsRouter);
todoListsRouter.use('/:todolistId/tasks', tasksRouter);
// --------------------------

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Backend!');
});

const startApp = async () => {
    try {
        await testDbConnection();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to DB or start server:', error);
        process.exit(1);
    }
};

startApp();