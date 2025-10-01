const express = require('express');
const router = express.Router();

const { analyzeMatch } = require('../controllers/matchController');

// Route pour l'analyse d'un match spécifique
router.post('/analyze', analyzeMatch);

module.exports = router;