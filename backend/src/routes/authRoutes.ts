// backend/src/routes/authRoutes.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // Импортируем bcryptjs (можно и import * as bcrypt from 'bcryptjs')
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// @ts-ignore (Импорт модели User)
const db = require('../../models');
const User = db.User;

dotenv.config(); // Убедимся, что JWT_SECRET загружен

export const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
    process.exit(1);
}

// POST /api/auth/register - Регистрация нового пользователя
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // --- Валидация входных данных ---
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
        }
        // Простая проверка длины пароля (можно добавить сложности)
        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        // Проверка формата email (Sequelize модель тоже проверяет, но лучше и здесь)
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
              res.status(400).json({ message: 'Invalid email format' });
         }
         // ---------------------------------

        // Проверка, не занят ли email
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            res.status(409).json({ message: 'Email already in use' }); // 409 Conflict
        }

        // Хеширование пароля
        const saltRounds = 10; // Количество раундов хеширования (стандартное значение)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Создание пользователя в БД
        const newUser = await User.create({
            email: email,
            password: hashedPassword
        });

        // Отправляем успешный ответ (без данных пользователя)
        // НЕ отправляем токен при регистрации
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error during registration:', error);
         // @ts-ignore (Проверка на ошибку валидации Sequelize)
        if (error.name === 'SequelizeValidationError') {
             // @ts-ignore
            res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
});

// POST /api/auth/login - Вход пользователя
authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
        }

        // Поиск пользователя по email
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
             // Не говорим "неверный email", чтобы не давать подсказок злоумышленникам
            res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
        }

        // Сравнение введенного пароля с хешем в БД
        // @ts-ignore (У user точно есть password, т.к. allowNull: false)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        // Пароль верный - генерируем JWT
        const tokenPayload = {
            userId: user.id // Включаем ID пользователя в токен
            // Можно добавить email или роли, если нужно, но ID обычно достаточно
        };

        const token = jwt.sign(
            tokenPayload,
            JWT_SECRET,
            { expiresIn: '1h' } // Время жизни токена (например, 1 час)
            // Можно использовать '1d' (день), '7d' (неделя) и т.д.
        );

        // Отправляем токен клиенту
        res.status(200).json({ token: token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});