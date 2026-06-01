const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  units: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, { timestamps: true });

// Prevent duplicate entries of same blood group for the same hospital
inventorySchema.index({ hospital: 1, bloodGroup: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
