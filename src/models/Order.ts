import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  userId: mongoose.Types.ObjectId;
  status: string;
}

const orderSchema = new Schema<IOrder>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>('Order', orderSchema);
