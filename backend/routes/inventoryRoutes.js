const express = require('express');
const router = express.Router();
const { updateInventory, getInventory } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, updateInventory)
  .get(protect, getInventory);

module.exports = router;
