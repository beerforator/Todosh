// backend/migrations/...-add-userId-to-todolists.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'TodoLists', // Таблица, куда добавляем
      'userId',    // Имя нового столбца
      {
        type: Sequelize.INTEGER,
        allowNull: false, // Список должен принадлежать пользователю
        references: {
          model: 'Users', // Ссылка на таблицу Users
          key: 'id',      // Ссылка на поле id в Users
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Удаление пользователя удалит его списки
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('TodoLists', 'userId');
  }
};