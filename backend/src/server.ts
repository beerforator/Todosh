import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { todoListsRouter } from '../routes/todoListRoutes';
import { tasksRouter } from '../routes/taskRoutes';

// Импортируем роутеры


// Загружаем переменные окружения из .env файла
dotenv.config();

// Создаем экземпляр Express приложения
const app = express();

// Определяем порт
const PORT = process.env.PORT || 3000; // Используем порт 3000, как ты указал

// Настраиваем middleware
app.use(cors());
app.use(express.json());

// Тестовый маршрут (можно оставить или удалить)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Backend!');
});

// Подключаем маршруты для тудулистов
app.use('/api/todolists', todoListsRouter);

// Подключаем маршруты для задач внутри тудулистов
// Обрати внимание, как мы "вкладываем" tasksRouter внутрь todoListsRouter
// Это стандартный способ организации вложенных ресурсов в Express
todoListsRouter.use('/:todolistId/tasks', tasksRouter);


// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});