const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  homeTeam: {
    type: String,
    required: true,
  },
  awayTeam: {
    type: String,
    required: true,
  },
  predictedOutcome: {
    type: String,
    required: true,
  },
  suretyPercentage: {
    type: Number,
    required: true,
  },
  analysisDetails: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prediction', predictionSchema);