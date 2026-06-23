import { fn, col } from 'sequelize';
import db from "../models/index.js"
const { User, Rating, Store } = db;

export const getStoreDashboard = async (req, res) => {
  try {
    const { storeId, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    if (!storeId) {
      return res.status(400).json({ error: 'storeId query parameter is required.' });
    }

    const store = await Store.findOne({ where: { id: storeId, ownerId: req.user.id } });
    if (!store) {
      return res.status(403).json({ error: 'You do not have permission to access this store\'s dashboard.' });
    }

    const avgResult = await Rating.findOne({
      where: { storeId },
      attributes: [[fn('AVG', col('rating')), 'averageRating']],
      raw: true,
    });
    const averageRating = parseFloat(avgResult?.averageRating || 0).toFixed(1);

    let orderClause = [['createdAt', 'DESC']];
    const orderDirection = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    if (sortBy === 'rating') {
      orderClause = [['rating', orderDirection]];
    } else if (sortBy === 'createdAt') {
      orderClause = [['createdAt', orderDirection]];
    } else if (sortBy === 'name') {
      orderClause = [[{ model: User, as: 'user' }, 'name', orderDirection]];
    } else if (sortBy === 'email') {
      orderClause = [[{ model: User, as: 'user' }, 'email', orderDirection]];
    } else if (sortBy === 'address') {
      orderClause = [[{ model: User, as: 'user' }, 'address', orderDirection]];
    }

    const ratings = await Rating.findAll({
      where: { storeId },
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'address']
      },
      order: orderClause
    });

    return res.json({
      averageRating,
      ratings
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    return res.status(500).json({ error: 'Server error loading dashboard details.' });
  }
};
