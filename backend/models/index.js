import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

import defineUser from './User.js';
import defineStore from './Store.js';
import defineRating from './Rating.js';

const dbUrl = process.env.DATABASE_URL || 'mysql://root:GovindGuddu%402004@127.0.0.1:3306/store_rating';

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  logging: false,
});

export const User = defineUser(sequelize);
export const Store = defineStore(sequelize);
export const Rating = defineRating(sequelize);

Store.hasOne(User, { foreignKey: 'storeId', as: 'owner', onDelete: 'CASCADE' });
User.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

export async function seedDatabase() {
  const adminCount = await User.count({ where: { role: 'ADMIN' } });
  if (adminCount === 0) {
    console.log('Seeding default administrator...');
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    await User.create({
      name: 'System Administrator Account',
      email: 'admin@mail.com',
      password: hashedPassword,
      address: 'System Admin',
      role: 'ADMIN',
    });
    console.log('Default administrator created (admin@example.com / Password123!).');
  }
}
