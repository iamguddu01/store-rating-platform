import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateCreateUser, validateCreateStore } from '../middleware/validation.js';
import { 
  getDashboardStats, 
  createUser, 
  createStore, 
  listUsers, 
  listStores, 
  getUserDetails 
} from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.post('/users', validateCreateUser, createUser);
router.post('/stores', validateCreateStore, createStore);
router.get('/users', listUsers);
router.get('/stores', listStores);
router.get('/users/:id', getUserDetails);

export default router;
