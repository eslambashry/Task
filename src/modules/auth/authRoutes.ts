import { Router } from 'express';
import { body } from 'express-validator';
import {
  signup,
  login,
  refreshToken,
  getProfile,
} from './authController';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validation';

const router = Router();

// Validation rules
const signupValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('displayName')
    .notEmpty()
    .withMessage('Display name is required')
    .trim(),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

// Routes
router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.post('/refresh-token', refreshTokenValidation, validate, refreshToken);
router.get('/profile', authenticate, getProfile);

export default router;
