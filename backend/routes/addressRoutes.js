const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const auth = require('../middleware/auth');

// Get all addresses for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new address
router.post('/', auth, async (req, res) => {
  try {
    const { street, city, state, pincode, isDefault } = req.body;
    
    // If this is set as default, unset any existing default address
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const address = new Address({
      user: req.user._id,
      street,
      city,
      state,
      pincode,
      isDefault: isDefault || false
    });

    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an address
router.put('/:id', auth, async (req, res) => {
  try {
    const { street, city, state, pincode, isDefault } = req.body;
    
    // If this is set as default, unset any existing default address
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { street, city, state, pincode, isDefault },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an address
router.delete('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 