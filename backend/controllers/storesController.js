import { Op, literal } from 'sequelize';
import db from "../models/index.js"
const { Store, Rating } = db;

export const listStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const userId = req.user.id;

    const whereClause = {};
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
      whereClause.address = { [Op.like]: `%${address}%` };
    }

    const validSortFields = ['name', 'address', 'rating'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDirection = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    const stores = await Store.findAll({
      where: whereClause,
      attributes: [
        'id',
        'name',
        'address',
        'email',
        [
          literal(`(
            SELECT IFNULL(AVG(rating), 0)
            FROM rating AS r
            WHERE r.storeId = Store.id
          )`),
          'averageRating'
        ],
        [
          literal(`(
            SELECT rating
            FROM rating AS r
            WHERE r.storeId = Store.id AND r.userId = ${userId}
            LIMIT 1
          )`),
          'userRating'
        ]
      ],
      order: orderField === 'rating'
        ? [[literal('averageRating'), orderDirection]]
        : [[orderField, orderDirection]]
    });

    return res.json(stores);
  } catch (error) {
    console.error('List stores error:', error);
    return res.status(500).json({ error: 'Server error listing stores.' });
  }
};

export const rateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const ratingVal = parseInt(rating, 10);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found.' });
    }

    const [userRating, created] = await Rating.findOrCreate({
      where: { userId, storeId: store.id },
      defaults: { rating: ratingVal }
    });

    if (!created) {
      userRating.rating = ratingVal;
      await userRating.save();
    }

    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [
        [literal('AVG(rating)'), 'averageRating']
      ],
      raw: true
    });

    const averageRating = parseFloat(avgResult?.averageRating || 0).toFixed(1);

    return res.json({
      message: created ? 'Rating submitted successfully.' : 'Rating updated successfully.',
      userRating: ratingVal,
      averageRating
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    return res.status(500).json({ error: 'Server error submitting rating.' });
  }
};
