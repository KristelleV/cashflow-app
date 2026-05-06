const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    retailerName: {
      type: String,
      required: [true, 'Please add retailer name'],
      trim: true,
    },
    projectName: {
      type: String,
      required: [true, 'Please add project name'],
      trim: true,
    },
    revenue: {
      type: Number,
      required: [true, 'Please add revenue'],
      min: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add end date'],
    },
    status: {
      type: String,
      enum: ['pipeline', 'in-progress', 'completed'],
      default: 'pipeline',
    },
    expenses: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    payment: {
      deposit: { type: Number, default: 0 },
      depositDate: Date,
      finalAmount: { type: Number, default: 0 },
      finalDate: Date,
      paymentDueDate: Date,
      receiptDate: Date,
    },
    files: [
      {
        fileName: String,
        fileSize: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate profit before saving
retailerSchema.pre('save', function (next) {
  this.profit = this.revenue - this.totalExpenses;
  next();
});

module.exports = mongoose.model('Retailer', retailerSchema);
