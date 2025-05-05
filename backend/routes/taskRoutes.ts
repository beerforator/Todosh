// backend/src/routes/taskRoutes.ts
import { Request, Response } from 'express';
const express = require('express')

export const tasksRouter = express.Router({ mergeParams: true });

// GET /api/todolists/:todolistId/tasks - Получить все задачи для тудулиста
tasksRouter.get('/', (req: Request, res: Response) => {
    const todolistId = req.params.todolistId;
    if (!todolistId) {
        // Явно возвращаем результат для этой ветки
        return res.status(400).send({ message: 'Todolist ID is required in URL' });
    }
    // Тоже добавляем return, хотя он и не обязателен для логики работы Express,
    // но помогает TypeScript понять, что функция завершается отправкой ответа.
    // Либо можно просто добавить return; на следующей строке.
    return res.status(200).send(`GET: All tasks for Todolist ${todolistId}`);
});

// POST /api/todolists/:todolistId/tasks - Создать новую задачу для тудулиста
tasksRouter.post('/', (req: Request, res: Response) => {
    const todolistId = req.params.todolistId;
    const title = req.body.title;
    if (!todolistId) {
         return res.status(400).send({ message: 'Todolist ID is required in URL' });
    }
    if (!title) {
        return res.status(400).send({ message: 'Task title is required' });
    }
    // Добавляем return
    return res.status(201).send(`POST: Task created for Todolist ${todolistId} with title: ${title}`);
});

// PUT /api/todolists/:todolistId/tasks/:taskId - Обновить задачу
tasksRouter.put('/:taskId', (req: Request, res: Response) => {
    const todolistId = req.params.todolistId;
    const taskId = req.params.taskId;
    const { title, isDone } = req.body;
     if (!todolistId || !taskId) {
         return res.status(400).send({ message: 'Todolist ID and Task ID are required in URL' });
    }
    // Добавляем return
    return res.status(200).send(`PUT: Task ${taskId} in Todolist ${todolistId} updated`);
});

// DELETE /api/todolists/:todolistId/tasks/:taskId - Удалить задачу
tasksRouter.delete('/:taskId', (req: Request, res: Response) => {
    const todolistId = req.params.todolistId;
    const taskId = req.params.taskId;
     if (!todolistId || !taskId) {
         return res.status(400).send({ message: 'Todolist ID and Task ID are required in URL' });
    }
    // Добавляем return
    return res.status(200).send(`DELETE: Task ${taskId} in Todolist ${todolistId} deleted`);
});