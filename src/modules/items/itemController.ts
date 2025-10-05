import { Request, Response } from 'express';
import Item from '../../models/Item';
import mongoose from 'mongoose';

export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    const item = new Item({
      name,
      description,
      createdBy: req.user?.userId,
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message,
    });
  }
};

export const getAllItems = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Item.find().populate('createdBy', 'displayName email');

    res.status(200).json({
      success: true,
      data: {
        items,
        count: items.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message,
    });
  }
};

export const getItemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
      return;
    }

    const item = await Item.findById(id).populate(
      'createdBy',
      'displayName email'
    );

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message,
    });
  }
};

export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
      return;
    }

    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    // Check if user is the creator
    if (item.createdBy.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'You can only update items you created',
      });
      return;
    }

    item.name = name || item.name;
    item.description = description || item.description;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: { item },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message,
    });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
      return;
    }

    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    // Check if user is the creator
    if (item.createdBy.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'You can only delete items you created',
      });
      return;
    }

    await Item.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message,
    });
  }
};
