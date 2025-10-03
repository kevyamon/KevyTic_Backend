// backend/src/controllers/matchController.js (VERSION DE TEST)
const { fetchData } = require('../utils/dataFetcher');
const { makePrediction } = require('../utils/predictionLogic');
const Prediction = require('../models/Prediction');
// On n'importe plus le service Gemini pour ce test
// const { analyzeMatchImage } = require('../services/geminiService');

const analyzeMatch = async (req, res) => {
  try {
    // Étape 1 : Vérification de la présence de l'image (on la garde pour que la requête ne change pas)
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image n\'a été téléchargée.' });
    }

    // Étape 2 : ON NE FAIT PAS APPEL À GEMINI. On utilise des données factices.
    console.log('--- MODE DE TEST ACTIF ---');
    const matchData = {
      team1: "Équipe Test 1",
      team2: "Équipe Test 2"
    };

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
    console.error('Erreur lors de l\'analyse du match (en mode test) :', error);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
};

module.exports = {
  analyzeMatch,
};