const Guest = require('../models/Guest');
const Event = require('../models/Event');

// @desc    Get guests for an event
// @route   GET /api/events/:eventId/guests
// @access  Private
const getGuests = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Verify user owns the event
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const guests = await Guest.find({ event: req.params.eventId });
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a guest to an event
// @route   POST /api/events/:eventId/guests
// @access  Private
const addGuest = async (req, res) => {
    try {
        const { name, phone, category, rsvpStatus } = req.body;

        if (!name || !phone || !category) {
            return res.status(400).json({ message: 'Please provide required fields' });
        }

        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const guest = await Guest.create({
            name,
            phone,
            category,
            rsvpStatus: rsvpStatus || 'Pending',
            event: req.params.eventId
        });

        res.status(201).json(guest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a guest (e.g. RSVP status)
// @route   PUT /api/guests/:id
// @access  Private
const updateGuest = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id).populate('event');
        
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        // Verify user owns the event the guest belongs to
        if (guest.event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedGuest = await Guest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedGuest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a guest
// @route   DELETE /api/guests/:id
// @access  Private
const deleteGuest = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id).populate('event');
        
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        if (guest.event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await guest.deleteOne();

        res.status(200).json({ message: 'Guest removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getGuests,
    addGuest,
    updateGuest,
    deleteGuest
};
