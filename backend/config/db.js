import { Sequelize } from 'sequelize';
import { configDotenv } from 'dotenv';
configDotenv();

const dbUrl = process.env.DATABASE_URL;

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  logging: false,
});
