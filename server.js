const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import des routes
const matchRoutes = require('./src/routes/matchRoutes');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/match', matchRoutes);

// Main route
app.get('/', (req, res) => {
  res.send('KevyTic Backend API is running!');
});

// Database connection
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });