const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  event: {
    type: String,
    required: [true, 'Event is required'],
    default: 'Synergia Technical Event'
  },
  ticketType: {
    type: String,
    required: true,
    enum: ['Standard', 'VIP', 'Student'],
    default: 'Standard'
  },
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);