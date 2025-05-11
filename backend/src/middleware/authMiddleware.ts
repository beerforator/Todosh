// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'; // Убедись, что NextFunction импортирован
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file for authMiddleware");
    process.exit(1);
}

declare global {
    namespace Express {
        interface Request {
            user?: { userId: number };
        }
    }
}

// Добавляем явный тип возвращаемого значения -> Promise<void> или просто void, т.к. async/await
// Или можно оставить как есть, но добавить return; после res.status().json()
export const authMiddleware = (req: Request, res: Response, next: NextFunction) /*: void | Promise<void> */ => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
        return; // <-- Добавляем return
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        req.user = { userId: decoded.userId };
        next(); // <-- Вызываем next()
        // НЕ добавляем return здесь

    } catch (error) {
        console.error('Token verification failed:', error);
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Unauthorized: Token expired' });
            return; // <-- Добавляем return
        }
         if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
            return; // <-- Добавляем return
        }
        res.status(401).json({ message: 'Unauthorized' });
        return; // <-- Добавляем return
    }
};