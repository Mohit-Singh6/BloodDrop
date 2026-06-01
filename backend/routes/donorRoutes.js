const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// FR-6: Protect routes, ensure only donors can access these routes
router.route('/profile')
  .get(protect, authorize('donor'), getProfile)
  .post(protect, authorize('donor'), updateProfile);

module.exports = router;
