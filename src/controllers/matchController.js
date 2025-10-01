const { fetchData } = require('../utils/dataFetcher');
const { makePrediction } = require('../utils/predictionLogic');
const Prediction = require('../models/Prediction');

const analyzeMatch = async (req, res) => {
  try {
    const { matchData } = req.body;

    if (!matchData || !matchData.team1 || !matchData.team2) {
      return res.status(400).json({ error: 'Données de match (équipe 1 et 2) manquantes.' });
    }

    // Étape 1 : Récupération des données du match (simulée ici)
    const fetchedData = await fetchData(matchData);

    // Étape 2 : Application de la logique de prédiction
    const predictionResult = makePrediction(fetchedData);
    
    // Étape 3 : Enregistrement du pronostic dans la base de données
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
      // Les boutons de l'application front-end utiliseront ces données
      // pour afficher des prédictions secondaires.
      analysisDetails: fetchedData,
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse du match :', error);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
};

module.exports = {
  analyzeMatch,
};