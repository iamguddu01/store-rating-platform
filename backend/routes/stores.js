import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { listStores, rateStore, getStoreById } from '../controllers/storesController.js';

const router = express.Router();

router.use(authenticate);
router.get('/:id', getStoreById);
router.use(requireRole('USER'));
router.get('/', listStores);
router.post('/:id/rate', rateStore);

export default router;
