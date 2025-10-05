import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from './orderController';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { validate } from '../../middleware/validation';

const router = Router();

// Validation rules
const orderValidation = [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

const orderStatusValidation = [
  body('status')
    .isIn(['pending', 'processing', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
];

// Routes
router.post('/', authenticate, orderValidation, validate, createOrder);
router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.put(
  '/:id/status',
  authenticate,
  requireAdmin,
  orderStatusValidation,
  validate,
  updateOrderStatus
);
router.delete('/:id', authenticate, deleteOrder);

export default router;
