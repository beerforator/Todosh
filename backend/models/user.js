// backend/models/user.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.TodoList, { // User имеет много TodoList
        foreignKey: 'userId',         // Внешний ключ в TodoList
        as: 'todolists'               // Псевдоним
      });   
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Подтверждаем уникальность на уровне модели
      validate: {   // Добавляем валидацию формата email
        isEmail: {
          msg: "Must be a valid email address",
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
       // Валидацию длины пароля лучше делать в коде перед хешированием
    }
  }, {
    sequelize,
    modelName: 'User',
    // Таблица будет 'Users'
  });
  return User;
};