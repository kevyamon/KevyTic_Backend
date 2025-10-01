const fetchData = async (matchData) => {
  // Dans une application réelle, cette fonction ferait le travail suivant :
  // 1. Utiliser les données `matchData` (comme les noms d'équipes et la date)
  //    pour trouver le match sur des sites comme Flashscore, Betclic, etc.
  // 2. Utiliser des outils de web scraping (comme Puppeteer ou Cheerio)
  //    pour extraire les informations clés :
  //    - Cotes des bookmakers (1X2, Over/Under, etc.)
  //    - Statistiques des équipes (forme récente, buts marqués/encaissés)
  //    - Informations sur l'équipe (blessures, suspensions)
  //    - Historique des confrontations directes
  // 3. Traiter ces données et les retourner.

  console.log(`Simulating data fetch for match: ${matchData.team1} vs ${matchData.team2}`);

  // Données factices pour la simulation
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
      homeTeam: ['Key Player A'],
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