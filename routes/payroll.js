const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const auth = require('../middleware/auth');

// Get all payroll entries for user
router.get('/', auth, async (req, res) => {
  try {
    const payrolls = await Payroll.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create payroll entry
router.post('/', auth, async (req, res) => {
  try {
    const { employeeName, amount, dueDate, frequency, notes } = req.body;

    const payroll = new Payroll({
      userId: req.userId,
      employeeName,
      amount,
      dueDate,
      frequency,
      notes,
    });

    await payroll.save();

    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update payroll entry
router.put('/:id', auth, async (req, res) => {
  try {
    let payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll entry not found' });
    }

    if (payroll.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete payroll entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll entry not found' });
    }

    if (payroll.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Payroll.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Payroll entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
