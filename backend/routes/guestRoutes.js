const express = require('express');
const router = express.Router();
const { getGuests, addGuest, updateGuest, deleteGuest } = require('../controllers/guestController');
const { protect } = require('../middleware/authMiddleware');

// Route prefixes will determine how they are called in server.js

// Require auth for all guest routes
router.use(protect);

// Routes for guests associated with an event ID
router.route('/events/:eventId/guests')
    .get(getGuests)
    .post(addGuest);

// Routes for specific guest ID operations
router.route('/guests/:id')
    .put(updateGuest)
    .delete(deleteGuest);

module.exports = router;
