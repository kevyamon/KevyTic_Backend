// backend/src/utils/dataFetcher.js
const fetchData = async (matchData) => {
  // Dans une future mission, cette fonction utilisera l'API Gemini pour :
  // 1. Utiliser les données `matchData` (les noms d'équipes extraits de l'image)
  //    pour trouver le match sur des sites de statistiques et de cotes.
  // 2. Extraire les informations clés :
  //    - Cotes des bookmakers (1X2, Over/Under, etc.)
  //    - Statistiques des équipes (forme récente, buts marqués/encaissés)
  //    - Informations sur l'équipe (blessures, suspensions)
  //    - Historique des confrontations directes
  // 3. Traiter ces données et les retourner dans un format structuré.

  console.log(`Simulation de la récupération de données pour le match : ${matchData.team1} vs ${matchData.team2}`);

  // Données factices pour la simulation, maintenant dynamiques avec les noms d'équipes
  const mockData = {
    teams: {
      home: matchData.team1,
      away: matchData.team2,
    },
    odds: {
      homeWin: 1.67,
      draw: 3.75,
      awayWin: 5.80,
      totalGoalsOver2_5: 2.05,
      totalGoalsUnder2_5: 1.78,
    },
    recentForm: {
      homeTeam: 'WWDDL', // Win, Win, Draw, Draw, Loss
      awayTeam: 'LLDLL',
    },
    h2h: {
      homeWins: 3,
      awayWins: 1,
      draws: 1,
    },
    injuries: {
      homeTeam: ['Joueur Clé A'],
      awayTeam: [],
    },
  };

  // Une petite pause pour simuler un chargement réseau
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return mockData;
};

module.exports = {
  fetchData,
};