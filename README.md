# Synergia Event Booking API

A complete REST API for event booking management with MongoDB Atlas.

## Features
- ✅ CRUD operations for bookings
- ✅ MongoDB Atlas cloud database
- ✅ Search bookings by email
- ✅ Filter bookings by event
- ✅ Input validation
- ✅ Error handling

## Setup
1. Clone this repository
2. Install dependencies: `npm install`
3. Update MongoDB connection string in `server.js`
4. Run: `npm run dev`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/:id` | Get booking by ID |
| PUT | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Delete booking |
| GET | `/api/bookings/search?email=xyz` | Search by email |
| GET | `/api/bookings/filter?event=xyz` | Filter by event |

## Example Request
```bash
# Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "event": "Synergia Event",
    "ticketType": "VIP"
  }'