const express = require('express');
const axios = require('axios');
const app = express();

const BASE_URL = 'https://api.mangadex.org';

// Endpoint /mangas
app.get('/mangas', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        'includes[]': ['author', 'artist', 'cover_art'],
        'order[latestUploadedChapter]': 'desc',
        ...req.query,
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar todos os mangás:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar todos os mangás' });
  }
});

// Exportar para Vercel
module.exports = app;
