import { Sequelize } from 'sequelize';

const dbUrl = process.env.DATABASE_URL || 'mysql://root:GovindGuddu%402004@127.0.0.1:3306/store_rating';

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  logging: false,
});
