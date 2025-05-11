// backend/models/task.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
 class Task extends Model {
   /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
   static associate(models) {
     // define association here
     Task.belongsTo(models.TodoList, { // Указываем, что Task принадлежит TodoList
       foreignKey: 'todolistId',       // Внешний ключ в этой модели (Task)
       as: 'todolist'                // Псевдоним для доступа к связанному тудулисту (необязательно)
     });
   }
 }
 Task.init({
   title: DataTypes.STRING,
   isDone: {                   // Добавим defaultValue для isDone
     type: DataTypes.BOOLEAN,
     defaultValue: false,    // Новые задачи по умолчанию не выполнены
     allowNull: false
   },
   // Мы добавим todolistId через миграцию, но Sequelize поймет связь через associate
   // Не нужно явно определять todolistId здесь в init, т.к. belongsTo сделает это
 }, {
   sequelize,
   modelName: 'Task',
   // Имя таблицы будет 'Tasks'
 });
 return Task;
};