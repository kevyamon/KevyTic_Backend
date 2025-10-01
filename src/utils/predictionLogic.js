const makePrediction = (data) => {
  const { odds, recentForm, h2h } = data;

  // Calcul d'un "score" pour chaque issue possible (victoire, nul, défaite)
  let homeWinScore = 0;
  let drawScore = 0;
  let awayWinScore = 0;

  // Plus la cote est basse, plus la probabilité implicite est haute.
  // Un score plus bas sur la cote contribue positivement.
  homeWinScore += (1 / odds.homeWin);
  drawScore += (1 / odds.draw);
  awayWinScore += (1 / odds.awayWin);

  // La forme récente de l'équipe a un impact important.
  // Une victoire (W) donne plus de points.
  const homeWinsRecent = recentForm.homeTeam.split('W').length - 1;
  const awayWinsRecent = recentForm.awayTeam.split('W').length - 1;
  homeWinScore += homeWinsRecent * 0.2;
  awayWinScore += awayWinsRecent * 0.2;

  // L'historique des confrontations directes compte également.
  homeWinScore += h2h.homeWins * 0.1;
  awayWinScore += h2h.awayWins * 0.1;

  // Déterminer l'issue la plus probable
  const scores = {
    homeWin: homeWinScore,
    draw: drawScore,
    awayWin: awayWinScore,
  };
  
  let mostLikelyOutcome = '';
  let maxScore = -1;
  for (const outcome in scores) {
    if (scores[outcome] > maxScore) {
      maxScore = scores[outcome];
      mostLikelyOutcome = outcome;
    }
  }

  // Calcul du pourcentage de sûreté basé sur la différence de scores.
  const totalScore = homeWinScore + drawScore + awayWinScore;
  const surety = (maxScore / totalScore) * 100;

  return {
    outcome: mostLikelyOutcome,
    surety: parseFloat(surety.toFixed(2)),
  };
};

module.exports = {
  makePrediction,
};