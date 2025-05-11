// backend/src/routes/taskRoutes.ts
import express, { Request, Response } from 'express';

// @ts-ignore
const db = require('../../models'); // Путь к папке models
const Task = db.Task;         // Модель Task
const TodoList = db.TodoList; // Модель TodoList для проверки существования родительского списка

// Router с mergeParams для доступа к :todolistId
export const tasksRouter = express.Router({ mergeParams: true });


// Middleware для проверки существования TodoList И принадлежности его текущему пользователю
const findTodoList = async (req: Request, res: Response, next: express.NextFunction) => {
    const todolistId = req.params.todolistId;
    const userId = req.user?.userId; // <-- Получаем userId

    if (!userId) { // <-- Проверяем наличие userId
         res.status(401).json({ message: 'Unauthorized: User ID not found in token' });
    }
    if (!todolistId) {
        res.status(400).json({ message: 'Todolist ID is required in URL parameters' });
    }
    try {
        // Ищем по ID тудулиста И ID пользователя
        const todolist = await TodoList.findOne({ where: { id: todolistId, userId: userId } }); // <-- Добавили userId
        if (!todolist) {
            // Если не найден - значит либо нет такого ID, либо он не принадлежит пользователю
            res.status(404).json({ message: `Todolist with id ${todolistId} not found or access denied` });
        }
        // @ts-ignore
        req.todolist = todolist; // Добавляем в запрос (хотя можно просто передавать todolistId дальше)
        next();
    } catch (error) {
        console.error('Error finding todolist for user:', error);
        res.status(500).json({ message: 'Failed to process request' });
    }
};

// --- Остальные обработчики (GET, POST, PUT, DELETE) остаются БЕЗ ИЗМЕНЕНИЙ ---
// так как middleware findTodoList уже выполнил проверку доступа к родительскому списку

// GET /api/todolists/:todolistId/tasks
tasksRouter.get('/', findTodoList, async (req: Request, res: Response) => {
    // @ts-ignore
    const todolistId = req.params.todolistId;
    try {
        // Логика остается прежней, т.к. мы уже знаем, что todolistId доступен пользователю
        const tasks = await Task.findAll({
            where: { todolistId: todolistId },
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(`Error fetching tasks for todolist ${todolistId}:`, error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

// POST /api/todolists/:todolistId/tasks
tasksRouter.post('/', findTodoList, async (req: Request, res: Response) => {
    // @ts-ignore


    const todolistId = req.params.todolistId;
    try {
         // Логика остается прежней
        const title = req.body.title;
        // ... валидация title ...
        if (!title || typeof title !== 'string' || title.trim() === '') {
            res.status(400).json({ message: 'Task title is required and must be a non-empty string' });
        }
        const newTask = await Task.create({
            title: title.trim(),
            todolistId: todolistId
        });
        res.status(201).json(newTask);
    } catch (error) {
        // ... обработка ошибок ...
        console.error(`Error creating task for todolist ${todolistId}:`, error);
        // @ts-ignore
        if (error.name === 'SequelizeValidationError') {
             // @ts-ignore
            res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Failed to create task' });
    }
});

// PUT /api/todolists/:todolistId/tasks/:taskId
tasksRouter.put('/:taskId', findTodoList, async (req: Request, res: Response) => {
    // @ts-ignore
    const todolistId = req.params.todolistId;
    const taskId = req.params.taskId;
     try {
        // Логика остается прежней
        const { title, isDone } = req.body;
        // ... валидация ...
        if (title === undefined && isDone === undefined) { res.status(400).json({ message: 'No update data provided (title or isDone)' }); }
        if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) { res.status(400).json({ message: 'Title must be a non-empty string if provided' }); }
        if (isDone !== undefined && typeof isDone !== 'boolean') { res.status(400).json({ message: 'isDone must be a boolean if provided' }); }

        // Ищем задачу только по taskId, т.к. доступ к todolistId уже проверен
        const task = await Task.findOne({ where: { id: taskId, todolistId: todolistId } }); // Условие todolistId здесь как доп. гарантия
        if (!task) {
            res.status(404).json({ message: `Task with id ${taskId} not found in todolist ${todolistId}` });
        }
        // ... обновление ...
        const updateData: { title?: string; isDone?: boolean } = {};
        if (title !== undefined) updateData.title = title.trim();
        if (isDone !== undefined) updateData.isDone = isDone;
        await task.update(updateData);

        res.status(200).json(task);
    } catch (error) {
         // ... обработка ошибок ...
        console.error(`Error updating task ${taskId} for todolist ${todolistId}:`, error);
        // @ts-ignore
        if (error.name === 'SequelizeValidationError') {
             // @ts-ignore
            res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Failed to update task' });
    }
});

// DELETE /api/todolists/:todolistId/tasks/:taskId
tasksRouter.delete('/:taskId', findTodoList, async (req: Request, res: Response) => {
    // @ts-ignore
    const todolistId = req.params.todolistId;
    const taskId = req.params.taskId;
    try {
        // Логика остается прежней
         const task = await Task.findOne({ where: { id: taskId, todolistId: todolistId } }); // Условие todolistId здесь как доп. гарантия
        if (!task) {
            res.status(404).json({ message: `Task with id ${taskId} not found in todolist ${todolistId}` });
        }
        await task.destroy();
        res.status(204).send();
    } catch (error) {
         // ... обработка ошибок ...
         console.error(`Error deleting task ${taskId} for todolist ${todolistId}:`, error);
         res.status(500).json({ message: 'Failed to delete task' });
    }
});