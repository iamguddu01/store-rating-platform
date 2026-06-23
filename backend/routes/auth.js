import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateSignup, validateUpdatePassword } from '../middleware/validation.js';
import { register, login, getProfile, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateSignup, register);
router.post('/login', login);
router.get('/me', authenticate, getProfile);
router.put('/password', authenticate, validateUpdatePassword, updatePassword);

export default router;
