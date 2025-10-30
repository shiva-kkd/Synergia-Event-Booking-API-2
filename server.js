const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// ========================
// MONGODB CONNECTION
// ========================
mongoose.connect('mongodb+srv://kokkadashivananda8_db_user:Shiva%408055@cluster0.3azaerq.mongodb.net/')
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully');
  })
  .catch(err => {
    console.log('❌ MongoDB Connection Failed:', err);
  });

// ========================
// MIDDLEWARE
// ========================
app.use(express.json());

// ========================
// IMPORT MODEL
// ========================
const Booking = require('./models/Booking');

// ========================
// API ROUTES
// ========================

// 1. GET ALL BOOKINGS
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// 2. CREATE NEW BOOKING
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, event, ticketType, phone } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields'
      });
    }

    const booking = await Booking.create({
      name,
      email: email.toLowerCase(),
      event: event || 'Synergia Technical Event',
      ticketType: ticketType || 'Standard',
      phone: phone || ''
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// 3. GET BOOKING BY ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// 4. UPDATE BOOKING
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
});

// 5. DELETE BOOKING
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// 6. SEARCH BY EMAIL
app.get('/api/bookings/search', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email query parameter is required'
      });
    }

    const bookings = await Booking.find({ 
      email: new RegExp(email, 'i') 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching bookings',
      error: error.message
    });
  }
});

// 7. FILTER BY EVENT
app.get('/api/bookings/filter', async (req, res) => {
  try {
    const { event } = req.query;

    if (!event) {
      return res.status(400).json({
        success: false,
        message: 'Event query parameter is required'
      });
    }

    const bookings = await Booking.find({ 
      event: new RegExp(event, 'i') 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filtering bookings',
      error: error.message
    });
  }
});

// ========================
// ADDITIONAL ROUTES
// ========================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 Synergia Event Booking API is running!',
    version: '2.0.0',
    database: 'MongoDB Atlas',
    endpoints: {
      getAllBookings: 'GET /api/bookings',
      createBooking: 'POST /api/bookings',
      getBooking: 'GET /api/bookings/:id',
      updateBooking: 'PUT /api/bookings/:id',
      deleteBooking: 'DELETE /api/bookings/:id',
      searchByEmail: 'GET /api/bookings/search?email=example@email.com',
      filterByEvent: 'GET /api/bookings/filter?event=Synergia'
    },
    example_booking: {
      name: 'John Doe',
      email: 'john@example.com',
      event: 'Synergia Technical Event (optional)',
      ticketType: 'Standard/VIP/Student (optional)',
      phone: '+1234567890 (optional)'
    }
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log('🚀 Synergia Event Booking API Started');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🗄️  Database: MongoDB Atlas`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('📚 API Docs: http://localhost:3000/');
});