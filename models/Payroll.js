const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeName: {
      type: String,
      required: [true, 'Please add employee name'],
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
      enum: ['one-time', 'weekly', 'bi-weekly', 'monthly'],
      default: 'monthly',
    },
    notes: String,
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

module.exports = mongoose.model('Payroll', payrollSchema);
