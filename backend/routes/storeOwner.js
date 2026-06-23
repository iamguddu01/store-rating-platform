import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { getStoreDashboard } from '../controllers/storeOwnerController.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('STORE_OWNER'));

router.get('/dashboard', getStoreDashboard);

export default router;
