// backend/models/todolist.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TodoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TodoList.hasMany(models.Task, { // Указываем, что TodoList имеет много Task
        foreignKey: 'todolistId',     // Внешний ключ в модели Task
        as: 'tasks'                   // Псевдоним для доступа к связанным задачам (необязательно, но удобно)
      });

      // Новая связь с User
      TodoList.belongsTo(models.User, { // TodoList принадлежит User
        foreignKey: 'userId',          // Внешний ключ в этой модели (TodoList)
        as: 'user'                    // Псевдоним
      });
    }
  }

  TodoList.init({
    title: DataTypes.STRING
    // Sequelize автоматически добавляет id, createdAt, updatedAt
  }, {
    sequelize,
    modelName: 'TodoList',
    // Имя таблицы будет 'TodoLists' (по умолчанию)
  });
  return TodoList;
};