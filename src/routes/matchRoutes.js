// backend/src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

const { analyzeMatch } = require('../controllers/matchController');

// Configuration de Multer pour stocker l'image en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// La route pour l'analyse d'un match utilise maintenant le middleware 'upload'
// pour accepter un seul fichier avec le nom de champ 'image'.
router.post('/analyze', upload.single('image'), analyzeMatch);

module.exports = router;