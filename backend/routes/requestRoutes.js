const express = require('express');
const router = express.Router();
const { createRequest, getRequests, respondToRequest, fulfillRequest } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('requester'), createRequest)
  .get(protect, getRequests);

router.put('/:id/respond', protect, authorize('donor'), respondToRequest);
router.put('/:id/fulfill', protect, authorize('requester'), fulfillRequest);

module.exports = router;
