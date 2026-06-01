const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate('requester', 'name email contactNumber city')
      .populate('matchedDonors.donor', 'name email contactNumber');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveHospital = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isHospital) {
      return res.status(400).json({ message: 'This user is not a hospital account' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Hospital account approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await request.deleteOne();
    res.json({ message: 'Request removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
