import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';


export const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'rating',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'storeId']
      }
    ]
});
