// backend/src/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialisation du client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Convertit un buffer en une partie de données base64 pour l'API Gemini.
 * @param {Buffer} buffer Le buffer de l'image.
 * @param {string} mimeType Le type MIME de l'image (ex: 'image/jpeg').
 * @returns {Object} Un objet représentant les données de l'image pour l'API.
 */
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

/**
 * Analyse une image de match de football pour en extraire les noms des équipes.
 * @param {Buffer} imageBuffer Le buffer de l'image à analyser.
 * @param {string} mimeType Le type MIME de l'image.
 * @returns {Promise<Object>} Un objet contenant les noms des deux équipes { team1, team2 }.
 * @throws {Error} Si l'analyse échoue ou si les données ne peuvent pas être parsées.
 */
async function analyzeMatchImage(imageBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  const prompt = `
    Analyse cette image d'un match de football.
    Identifie UNIQUEMENT les noms des deux équipes qui s'affrontent.
    Retourne le résultat sous la forme d'un objet JSON valide avec les clés "team1" et "team2".
    Par exemple : { "team1": "Nom Équipe 1", "team2": "Nom Équipe 2" }.
    Ne retourne rien d'autre que cet objet JSON.
  `;

  const imagePart = fileToGenerativePart(imageBuffer, mimeType);
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  try {
    // Nettoyer la réponse pour extraire uniquement le JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
    if (!jsonMatch) {
      throw new Error('Aucun JSON trouvé dans la réponse de l"IA.');
    }
    
    // Prioriser la capture de bloc de code JSON, sinon prendre l'objet brut
    const jsonString = jsonMatch[1] || jsonMatch[2];
    const parsed = JSON.parse(jsonString);

    if (parsed.team1 && parsed.team2) {
      return parsed;
    } else {
      throw new Error('Le JSON retourné ne contient pas les clés "team1" et "team2".');
    }
  } catch (e) {
    console.error('Erreur de parsing du JSON de Gemini :', e);
    console.error('Réponse brute reçue :', text);
    throw new Error('Impossible d"interpréter la réponse de l"IA.');
  }
}

module.exports = {
  analyzeMatchImage,
};