const express = require('express');
const router = express.Router();
const Overhead = require('../models/Overhead');
const auth = require('../middleware/auth');

// Get all overhead entries for user
router.get('/', auth, async (req, res) => {
  try {
    const overheads = await Overhead.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.status(200).json({ success: true, data: overheads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create overhead entry
router.post('/', auth, async (req, res) => {
  try {
    const { expenseName, amount, dueDate, frequency, category } = req.body;

    const overhead = new Overhead({
      userId: req.userId,
      expenseName,
      amount,
      dueDate,
      frequency,
      category,
    });

    await overhead.save();

    res.status(201).json({ success: true, data: overhead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update overhead entry
router.put('/:id', auth, async (req, res) => {
  try {
    let overhead = await Overhead.findById(req.params.id);

    if (!overhead) {
      return res.status(404).json({ message: 'Overhead entry not found' });
    }

    if (overhead.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    overhead = await Overhead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: overhead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete overhead entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const overhead = await Overhead.findById(req.params.id);

    if (!overhead) {
      return res.status(404).json({ message: 'Overhead entry not found' });
    }

    if (overhead.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Overhead.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Overhead entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
