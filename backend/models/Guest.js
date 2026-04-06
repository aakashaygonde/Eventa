const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Family', 'Friends', 'Colleagues', 'VIP']
    },
    rsvpStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Attending', 'Declined']
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Guest', guestSchema);
