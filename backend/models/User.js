import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('User', {
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: { len: [0, 400] }
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'USER', 'STORE_OWNER'),
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    }
  }, {
    tableName: 'user',
    timestamps: true
  });
};
