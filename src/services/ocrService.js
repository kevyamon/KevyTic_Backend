// backend/src/services/ocrService.js
const { createWorker } = require('tesseract.js');

/**
 * Analyse une image de match de football pour en extraire les noms des équipes via OCR.
 * @param {Buffer} imageBuffer Le buffer de l'image à analyser.
 * @returns {Promise<Object>} Un objet contenant les noms des deux équipes { team1, team2 }.
 * @throws {Error} Si l'analyse OCR échoue ou si les équipes ne sont pas trouvées.
 */
async function analyzeMatchImage(imageBuffer) {
  let worker;
  try {
    worker = await createWorker();
    await worker.loadLanguage('eng'); // Nous utilisons l'anglais car les noms d'équipes sont souvent internationaux
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(imageBuffer);
    
    // Tentative simple d'extraire les noms d'équipe.
    // On cherche une ligne contenant 'vs', 'VS', ou '-'.
    const lines = text.split('\n');
    for (const line of lines) {
      // Expression régulière pour capturer "Équipe 1 vs Équipe 2" ou "Équipe 1 - Équipe 2"
      const match = line.match(/([a-zA-Z\s\.]+)\s(?:vs|-)\s([a-zA-Z\s\.]+)/i);
      
      if (match && match[1] && match[2]) {
        const team1 = match[1].trim();
        const team2 = match[2].trim();

        // Filtre basique pour éviter les faux positifs
        if (team1.length > 2 && team2.length > 2) {
          return { team1, team2 };
        }
      }
    }

    throw new Error('Impossible de trouver les noms des équipes dans le texte extrait.');

  } catch (error) {
    console.error('Erreur OCR:', error);
    throw new Error('Erreur lors de l\'analyse de l\'image.');
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

module.exports = {
  analyzeMatchImage,
};