import bcrypt from 'bcryptjs';
import { Op, fn, col, literal } from 'sequelize';
import db from "../models/index.js"
const { User, Store, Rating } = db;



export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    return res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ error: 'Server error loading dashboard statistics.' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;


    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role.toUpperCase(),
    });

    return res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    return res.status(500).json({ error: 'Server error creating user.' });
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerEmail } = req.body;

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ error: 'A store with this email already exists.' });
    }

    const user = await User.findOne({ where: { email: ownerEmail } });
    if (!user) {
      return res.status(400).json({ error: 'No user account found with this owner email. Please create the owner account first.' });
    }
    if (user.role !== 'STORE_OWNER') {
      return res.status(400).json({ error: `The email provided belongs to an account with role "${user.role}". A store can only be assigned to a STORE_OWNER.` });
    }
    const owner = user;

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: owner.id,
    });

    return res.status(201).json({
      message: 'Store created successfully and associated with the owner.',
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: owner.id,
      }
    });
  } catch (error) {
    console.error('Admin create store error:', error);
    return res.status(500).json({ error: 'Server error creating store.' });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const whereClause = {
      role: {
        [Op.in]: ['ADMIN', 'USER', 'STORE_OWNER']
      }
    };

    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };
    if (role) {
      const upperRole = role.toUpperCase();
      if (['ADMIN', 'USER', 'STORE_OWNER'].includes(upperRole)) {
        whereClause.role = upperRole;
      }
    }

    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDirection = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      order: [[orderField, orderDirection]],
    });

    return res.json(users);
  } catch (error) {
    console.error('Admin list users error:', error);
    return res.status(500).json({ error: 'Server error listing users.' });
  }
};

export const listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };

    const validSortFields = ['name', 'email', 'address', 'createdAt', 'rating'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDirection = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    const stores = await Store.findAll({
      where: whereClause,
      attributes: [
        'id', 'name', 'email', 'address', 'createdAt',
        [
          literal(`(
            SELECT IFNULL(AVG(rating), 0)
            FROM rating AS r
            WHERE r.storeId = Store.id
          )`),
          'averageRating'
        ]
      ],
      include: {
        model: User,
        as: 'owner',
        attributes: ['id']
      },
      order: orderField === 'rating' 
        ? [[literal('averageRating'), orderDirection]]
        : [[orderField, orderDirection]]
    });

    return res.json(stores);
  } catch (error) {
    console.error('Admin list stores error:', error);
    return res.status(500).json({ error: 'Server error listing stores.' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      include: {
        model: Store,
        as: 'stores',
        attributes: ['id', 'name', 'address', 'email']
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const details = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
    };

    if (user.role === 'STORE_OWNER' && user.stores && user.stores.length > 0) {
      const storesWithRatings = await Promise.all(
        user.stores.map(async (s) => {
          const ratingInfo = await Rating.findOne({
            where: { storeId: s.id },
            attributes: [[fn('AVG', col('rating')), 'averageRating']],
            raw: true,
          });
          return {
            id: s.id,
            name: s.name,
            email: s.email,
            address: s.address,
            averageRating: parseFloat(ratingInfo?.averageRating || 0).toFixed(1)
          };
        })
      );
      details.stores = storesWithRatings;
    } else {
      details.stores = [];
    }

    return res.json(details);
  } catch (error) {
    console.error('Admin get user details error:', error);
    return res.status(500).json({ error: 'Server error retrieving user details.' });
  }
};
