const Inventory = require('../models/Inventory');

exports.updateInventory = async (req, res) => {
  try {
    const { bloodGroup, units } = req.body;

    if (!bloodGroup || units === undefined) {
      return res.status(400).json({ message: 'Please provide bloodGroup and units' });
    }

    // Check if the user is a hospital and is approved
    if (!req.user.isHospital) {
      return res.status(403).json({ message: 'Only hospital accounts can update inventory' });
    }
    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Your hospital account is pending approval by the admin' });
    }

    // Upsert: Find one and update, or create if it doesn't exist
    const inventory = await Inventory.findOneAndUpdate(
      { hospital: req.user._id, bloodGroup },
      { units: Number(units) },
      { new: true, upsert: true }
    );

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('hospital', 'name email contactNumber city isApproved')
      .sort({ updatedAt: -1 });

    // Filter to only show inventory from approved hospitals
    const approvedInventory = inventory.filter(item => item.hospital && item.hospital.isApproved);

    res.json(approvedInventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
