// backend/src/db/config.ts

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config(); // Убедимся, что .env загружен
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

// if (!dbName || !dbUser || !dbHost || !dbPassword) {
//  throw new Error('Database configuration environment variables are missing!');
// }

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
 host: dbHost,
 port: dbPort,
 dialect: 'postgres',
 logging: false, // Отключаем логирование SQL-запросов в консоль (можно включить для отладки: console.log)
  // Опции для облачных БД с SSL:
 // dialectOptions: {
 //   ssl: {
 //     require: true,
 //     rejectUnauthorized: false // В зависимости от настроек провайдера
 //   }
 // }
});

// Функция для проверки соединения
export const testDbConnection = async () => {

 try {
   await sequelize.authenticate();
   console.log('PostgreSQL Connection has been established successfully.');
 } catch (error) {
   console.error('Unable to connect to the PostgreSQL database:', error);
   throw error; // Пробрасываем ошибку дальше, чтобы приложение не запустилось
 }
};
export default sequelize; // Экспортируем инстанс Sequelize для использования в моделях и т.д.