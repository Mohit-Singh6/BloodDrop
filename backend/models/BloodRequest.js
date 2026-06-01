const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsRequired: {
    type: Number,
    required: true,
    min: 1
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  status: {
    type: String,
    enum: ['Created', 'Accepted', 'Completed'],
    default: 'Created'
  },
  matchedDonors: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    donorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonorProfile'
    },
    status: {
      type: String,
      enum: ['Notified', 'Accepted', 'Ignored'],
      default: 'Notified'
    },
    notifiedAt: {
      type: Date,
      default: Date.now
    },
    respondedAt: {
      type: Date
    }
  }]
}, { timestamps: true });

bloodRequestSchema.pre('save', async function() {
  if (!this.requestId) {
    const count = await mongoose.model('BloodRequest').countDocuments();
    const uniqueNumber = Math.floor(10000 + Math.random() * 90000); // 5 digit random number
    this.requestId = `REQ-${count + 1}-${uniqueNumber}`;
  }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
