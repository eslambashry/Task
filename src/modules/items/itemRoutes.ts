import { Router } from 'express';
import { body } from 'express-validator';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from './itemController';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validation';

const router = Router();

// Validation rules
const itemValidation = [
  body('name').notEmpty().withMessage('Item name is required').trim(),
  body('description')
    .notEmpty()
    .withMessage('Item description is required')
    .trim(),
];

const itemUpdateValidation = [
  body('name').optional().trim(),
  body('description').optional().trim(),
];

// Routes
router.post('/', authenticate, itemValidation, validate, createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', authenticate, itemUpdateValidation, validate, updateItem);
router.delete('/:id', authenticate, deleteItem);

export default router;
