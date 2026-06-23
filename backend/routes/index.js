import express from 'express';
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import storeRoutes from './stores.js';
import storeOwnerRoutes from './storeOwner.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/stores', storeRoutes);
router.use('/store-owner', storeOwnerRoutes);

export default router;
