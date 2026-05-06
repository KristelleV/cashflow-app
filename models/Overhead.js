const mongoose = require('mongoose');

const overheadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expenseName: {
      type: String,
      required: [true, 'Please add expense name'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add amount'],
      min: 0,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add due date'],
    },
    frequency: {
      type: String,
      enum: ['one-time', 'weekly', 'monthly', 'quarterly', 'annual'],
      default: 'monthly',
    },
    category: {
      type: String,
      enum: ['rent', 'utilities', 'insurance', 'software', 'marketing', 'supplies', 'equipment', 'maintenance', 'other'],
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paidDate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Overhead', overheadSchema);
