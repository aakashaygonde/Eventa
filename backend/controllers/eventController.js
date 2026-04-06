const Event = require('../models/Event');

// @desc    Create an event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    try {
        const { title, date, venue } = req.body;

        if (!title || !date || !venue) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const event = await Event.create({
            title,
            date,
            venue,
            createdBy: req.user.id // set by authMiddleware
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not create event' });
    }
};

// @desc    Get all events for logged in user
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user.id });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not fetch events' });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check for user ownership
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns the updated document
        );

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not update event' });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check for user ownership
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this event' });
        }

        await event.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not delete event' });
    }
};

module.exports = {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent
};
