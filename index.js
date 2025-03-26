import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

const BASE_URL = 'https://api.mangadex.org';
const BASE_IMAGE_URL = 'https://uploads.mangadex.org';

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

    const mangas = response.data.data;

    const enriched = mangas.map((manga) => {
      const relationships = manga.relationships || [];

      const cover = relationships.find(rel => rel.type === 'cover_art');
      const author = relationships.find(rel => rel.type === 'author');
      const artist = relationships.find(rel => rel.type === 'artist');

      const coverFileName = cover?.attributes?.fileName;
      const coverUrl = coverFileName ? `${BASE_IMAGE_URL}/covers/${manga.id}/${coverFileName}.256.jpg` : null;

      return {
        id: manga.id,
        type: manga.type,
        attributes: manga.attributes,
        relationships,
        authorName: author?.attributes?.name || null,
        artistName: artist?.attributes?.name || null,
        coverFileName,
        coverUrl,
      };
    });

    res.json({ result: 'ok', data: enriched });
  } catch (error) {
    console.error('Erro ao buscar todos os mangás:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar todos os mangás' });
  }
});

export default app;
