import { Request, Response } from 'express';
import Order from '../../models/Order';
import Item from '../../models/Item';
import mongoose from 'mongoose';

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { itemId, quantity } = req.body;

    // Validate item exists
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
      return;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    const order = new Order({
      itemId,
      quantity,
      userId: req.user?.userId,
      status: 'pending',
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('itemId', 'name description')
      .populate('userId', 'displayName email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let query = {};

    // If not admin, only show user's own orders
    if (!req.user?.isAdmin) {
      query = { userId: req.user?.userId };
    }

    const orders = await Order.find(query)
      .populate('itemId', 'name description')
      .populate('userId', 'displayName email');

    res.status(200).json({
      success: true,
      data: {
        orders,
        count: orders.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid order ID',
      });
      return;
    }

    const order = await Order.findById(id)
      .populate('itemId', 'name description')
      .populate('userId', 'displayName email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    // Check if user has access to this order
    if (
      !req.user?.isAdmin &&
      order.userId._id.toString() !== req.user?.userId
    ) {
      res.status(403).json({
        success: false,
        message: 'You can only view your own orders',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid order ID',
      });
      return;
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('itemId', 'name description')
      .populate('userId', 'displayName email');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order: populatedOrder },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid order ID',
      });
      return;
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    // Check if user is the creator
    if (order.userId.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'You can only delete orders you created',
      });
      return;
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
};
