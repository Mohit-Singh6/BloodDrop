const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, contactNumber, state, city } = req.body;

    if (role === 'admin') {
      return res.status(400).json({ message: 'Cannot register as admin publicly' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const isHospital = role === 'hospital';
    const dbRole = isHospital ? 'requester' : role;
    const isApproved = !isHospital;

    const user = await User.create({
      name,
      email,
      password, // hashed in pre-save middleware
      role: dbRole,
      contactNumber,
      state,
      city,
      isHospital,
      isApproved
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isHospital: user.isHospital,
      isApproved: user.isApproved,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isHospital: user.isHospital,
        isApproved: user.isApproved,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
