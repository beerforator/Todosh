// backend/migrations/zzzzzzzzzzzzzz-add-todolistId-to-tasks.js

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {

 async up(queryInterface, Sequelize) {
   await queryInterface.addColumn(
     'Tasks', // Имя таблицы, куда добавляем столбец
     'todolistId', // Имя нового столбца (внешний ключ)
     {
       type: Sequelize.INTEGER, // Тип данных должен совпадать с типом id в таблице TodoLists (по умолчанию INTEGER)
       allowNull: false, // Задача должна принадлежать какому-то списку
       references: {
         model: 'TodoLists', // Имя таблицы, на которую ссылаемся
         key: 'id',       // Поле в таблице TodoLists, на которое ссылаемся
       },
       onUpdate: 'CASCADE', // При обновлении id в TodoLists, обновить и здесь
       onDelete: 'CASCADE', // При удалении TodoList, удалить связанные задачи
     }
   );
 },

 async down(queryInterface, Sequelize) {
   await queryInterface.removeColumn(
     'Tasks', // Имя таблицы, откуда удаляем столбец
     'todolistId' // Имя удаляемого столбца
   );
 }
};