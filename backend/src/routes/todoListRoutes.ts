// backend/src/routes/todoListRoutes.ts
import express, { Request, Response } from 'express';

// @ts-ignore
const db = require('../../models');
const TodoList = db.TodoList;
const Task = db.Task;

export const todoListsRouter = express.Router();

// GET /api/todolists - Получить все тудулисты ТЕКУЩЕГО пользователя
todoListsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId; // Получаем userId из middleware

        if (!userId) { // Эта проверка на всякий случай, middleware должен был ее сделать
             res.status(401).json({ message: 'Unauthorized: User ID not found in token' });
        }

        // Ищем только списки, принадлежащие этому пользователю
        const lists = await TodoList.findAll({
            where: { userId: userId }, // <-- Условие по userId
            order: [['createdAt', 'DESC']]
            // include: [{ model: Task, as: 'tasks' }] // Можно добавить, если нужно получать задачи сразу
        });
        res.status(200).json(lists);
    } catch (error) {
        console.error('Error fetching user todolists:', error);
        res.status(500).json({ message: 'Failed to fetch todolists' });
    }
});

// POST /api/todolists - Создать новый тудулист для ТЕКУЩЕГО пользователя
todoListsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const title = req.body.title;

        if (!userId) {
             res.status(401).json({ message: 'Unauthorized: User ID not found in token' });
        }
        if (!title || typeof title !== 'string' || title.trim() === '') {
            res.status(400).json({ message: 'Title is required and must be a non-empty string' });
        }

        // Создаем список, явно указывая userId
        const newList = await TodoList.create({
            title: title.trim(),
            userId: userId // <-- Привязываем к пользователю
        });
        res.status(201).json(newList);
    } catch (error) {
        console.error('Error creating todolist for user:', error);
        // ... (обработка ошибок валидации и 500)
        // @ts-ignore
        if (error.name === 'SequelizeValidationError') {
            // @ts-ignore
            res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Failed to create todolist' });
    }
});

// PUT /api/todolists/:id - Обновить тудулист (проверяем, что он принадлежит ТЕКУЩЕМУ пользователю)
todoListsRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const listId = req.params.id;
        const title = req.body.title;

         if (!userId) {
             res.status(401).json({ message: 'Unauthorized: User ID not found in token' });
        }
        if (!title || typeof title !== 'string' || title.trim() === '') {
            res.status(400).json({ message: 'New title is required and must be a non-empty string' });
        }

        // Ищем список по ID И userId
        const list = await TodoList.findOne({ where: { id: listId, userId: userId } }); // <-- Добавили userId в условие
        if (!list) {
            // Либо не найден, либо не принадлежит пользователю - возвращаем 404
            res.status(404).json({ message: 'Todolist not found or access denied' });
        }

        list.title = title.trim();
        await list.save();

        res.status(200).json(list);
    } catch (error) {
        console.error('Error updating todolist for user:', error);
        // ... (обработка ошибок валидации и 500)
         // @ts-ignore
        if (error.name === 'SequelizeValidationError') {
             // @ts-ignore
            res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Failed to update todolist' });
    }
});

// DELETE /api/todolists/:id - Удалить тудулист (проверяем, что он принадлежит ТЕКУЩЕМУ пользователю)
todoListsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const listId = req.params.id;

         if (!userId) {
             res.status(401).json({ message: 'Unauthorized: User ID not found in token' });
        }

        // Ищем список по ID И userId
        const list = await TodoList.findOne({ where: { id: listId, userId: userId } }); // <-- Добавили userId в условие
        if (!list) {
             // Либо не найден, либо не принадлежит пользователю - возвращаем 404
            res.status(404).json({ message: 'Todolist not found or access denied' });
        }

        await list.destroy(); // onDelete: 'CASCADE' удалит и задачи

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting todolist for user:', error);
        res.status(500).json({ message: 'Failed to delete todolist' });
    }
});