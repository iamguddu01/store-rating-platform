import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [20, 60] }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: { len: [0, 400] }
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'store',
    timestamps: true
  }
);

