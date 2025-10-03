// backend/src/controllers/matchController.js
const { fetchData } = require('../utils/dataFetcher');
const { makePrediction } = require('../utils/predictionLogic');
const Prediction = require('../models/Prediction');
const { analyzeMatchImage } = require('../services/geminiService');

const analyzeMatch = async (req, res) => {
  try {
    // Étape 1 : Vérification de la présence de l'image
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image n\'a été téléchargée.' });
    }

    // Étape 2 : Analyse de l'image par le service Gemini
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const matchData = await analyzeMatchImage(imageBuffer, mimeType);

    if (!matchData || !matchData.team1 || !matchData.team2) {
      return res.status(400).json({ error: 'L\'IA n\'a pas pu extraire les noms des équipes de l\'image.' });
    }

    // Étape 3 : Récupération des données du match (toujours simulée pour l'instant)
    const fetchedData = await fetchData(matchData);

    // Étape 4 : Application de la logique de prédiction
    const predictionResult = makePrediction(fetchedData);
    
    // Étape 5 : Enregistrement du pronostic dans la base de données
    const newPrediction = new Prediction({
      homeTeam: matchData.team1,
      awayTeam: matchData.team2,
      predictedOutcome: predictionResult.outcome,
      suretyPercentage: predictionResult.surety,
      analysisDetails: fetchedData, // On sauvegarde les données utilisées pour l'analyse
    });
    await newPrediction.save();

    res.status(200).json({
      message: 'Analyse et pronostic réussis.',
      prediction: predictionResult,
      analysisDetails: fetchedData,
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse du match :', error);
    // Fournir une erreur plus spécifique si elle vient de Gemini
    if (error.message.includes('IA')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
};

module.exports = {
  analyzeMatch,
};