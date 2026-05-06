const express = require('express');
const router = express.Router();
const Retailer = require('../models/Retailer');
const auth = require('../middleware/auth');

// Get all retailer projects for user
router.get('/', auth, async (req, res) => {
  try {
    const retailers = await Retailer.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: retailers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single retailer project
router.get('/:id', auth, async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.params.id);

    if (!retailer) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (retailer.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: retailer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create retailer project
router.post('/', auth, async (req, res) => {
  try {
    const { retailerName, projectName, revenue, startDate, endDate, status, expenses, totalExpenses, payment, files } = req.body;

    const retailer = new Retailer({
      userId: req.userId,
      retailerName,
      projectName,
      revenue,
      startDate,
      endDate,
      status,
      expenses,
      totalExpenses,
      payment,
      files,
    });

    await retailer.save();

    res.status(201).json({ success: true, data: retailer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update retailer project
router.put('/:id', auth, async (req, res) => {
  try {
    let retailer = await Retailer.findById(req.params.id);

    if (!retailer) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (retailer.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    retailer = await Retailer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: retailer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete retailer project
router.delete('/:id', auth, async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.params.id);

    if (!retailer) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (retailer.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Retailer.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const retailers = await Retailer.find({ userId: req.userId });

    const totalRevenue = retailers.reduce((sum, r) => sum + r.revenue, 0);
    const totalExpenses = retailers.reduce((sum, r) => sum + r.totalExpenses, 0);
    const totalProfit = totalRevenue - totalExpenses;

    const upcomingPayments = retailers.filter(r => {
      const daysUntil = Math.ceil((new Date(r.payment.paymentDueDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7 && daysUntil > 0 && !r.payment.receiptDate;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        projectCount: retailers.length,
        upcomingPayments: upcomingPayments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
