const express = require('express');
const router = express.Router();
const { getUsers, getRequests, approveHospital, deleteUser, deleteRequest } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Restrict all routes to admin role
router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.get('/requests', getRequests);
router.put('/users/:id/approve', approveHospital);
router.delete('/users/:id', deleteUser);
router.delete('/requests/:id', deleteRequest);

module.exports = router;
