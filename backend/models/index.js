import { sequelize } from '../config/db.js';
import { User } from './User.js';
import { Store } from './Store.js';
import { Rating } from './Rating.js';
import bcrypt from 'bcryptjs';

// Setup Associations
User.hasMany(Store, { foreignKey: 'ownerId', as: 'stores', onDelete: 'CASCADE' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

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

export const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("DATABASE CONNECTED");
    await sequelize.sync({ alter: true });
    console.log("Database Synchronized");
    await seedDatabase();
  } catch (error) {
    console.log("Database Connection failed,", error);
  }
};

const db = {
  User,
  Store,
  Rating,
};

export default db;