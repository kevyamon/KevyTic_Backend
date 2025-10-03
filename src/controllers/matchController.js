// backend/src/controllers/matchController.js
const { fetchData } = require('../utils/dataFetcher');
const { makePrediction } = require('../utils/predictionLogic');
const Prediction = require('../models/Prediction');
// On remplace l'ancien service par le nouveau
const { analyzeMatchImage } = require('../services/ocrService');

const analyzeMatch = async (req, res) => {
  try {
    // Étape 1 : Vérification de la présence de l'image
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image n\'a été téléchargée.' });
    }

    // Étape 2 : Analyse de l'image par le service OCR Tesseract
    const imageBuffer = req.file.buffer;
    const matchData = await analyzeMatchImage(imageBuffer);

    if (!matchData || !matchData.team1 || !matchData.team2) {
      return res.status(400).json({ error: 'L\'OCR n\'a pas pu extraire les noms des équipes de l\'image.' });
    }

    // Étape 3 : Récupération des données du match (simulée)
    const fetchedData = await fetchData(matchData);

    // Étape 4 : Application de la logique de prédiction
    const predictionResult = makePrediction(fetchedData);
    
    // Étape 5 : Enregistrement du pronostic dans la base de données
    const newPrediction = new Prediction({
      homeTeam: matchData.team1,
      awayTeam: matchData.team2,
      predictedOutcome: predictionResult.outcome,
      suretyPercentage: predictionResult.surety,
      analysisDetails: fetchedData,
    });
    await newPrediction.save();

    res.status(200).json({
      message: 'Analyse et pronostic réussis.',
      prediction: predictionResult,
      analysisDetails: fetchedData,
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse du match :', error);
    if (error.message.includes('OCR') || error.message.includes('équipes')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
};

module.exports = {
  analyzeMatch,
};