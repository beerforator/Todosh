// backend/src/routes/todoListRoutes.ts
import { Request, Response } from 'express';
const express = require('express')

export const todoListsRouter = express.Router();

// GET /api/todolists - Получить все тудулисты
todoListsRouter.get('/', (req: Request, res: Response) => {
    // Логика получения тудулистов (пока заглушка)
    res.status(200).send('GET: All Todolists'); // Отправляем статус 200 OK
});

// POST /api/todolists - Создать новый тудулист
todoListsRouter.post('/', (req: Request, res: Response) => {
    // Логика создания тудулиста (пока заглушка)
    const title = req.body.title; // Предполагаем, что title придет в теле запроса
    if (!title) {
        return res.status(400).send({ message: 'Title is required' }); // Отправляем ошибку 400 Bad Request
    }
    res.status(201).send(`POST: Todolist created with title: ${title}`); // Отправляем статус 201 Created
});

// PUT /api/todolists/:id - Обновить тудулист
todoListsRouter.put('/:id', (req: Request, res: Response) => {
    // Логика обновления тудулиста (пока заглушка)
    const listId = req.params.id;
    const title = req.body.title;
    if (!title) {
        return res.status(400).send({ message: 'New title is required' });
    }
    res.status(200).send(`PUT: Todolist ${listId} updated with title: ${title}`);
});

// DELETE /api/todolists/:id - Удалить тудулист
todoListsRouter.delete('/:id', (req: Request, res: Response) => {
    // Логика удаления тудулиста (пока заглушка)
    const listId = req.params.id;
    res.status(200).send(`DELETE: Todolist ${listId} deleted`);
     // В реальном приложении лучше отправлять 204 No Content, но для отладки 200 с текстом удобнее
});

// --- Маршруты для задач внутри конкретного тудулиста ---
// Мы определим их в отдельном роутере и подключим здесь позже