const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true 
  },
  healthDeclaration: { 
    type: String, 
    required: true 
  },
  lastDonationDate: { 
    type: Date 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  isEligible: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('DonorProfile', donorProfileSchema);
