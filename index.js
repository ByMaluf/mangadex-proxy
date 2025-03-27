import express from 'express';
import axios from 'axios';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

const BASE_URL = 'https://api.mangadex.org';
const BASE_IMAGE_URL = 'https://uploads.mangadex.org';

// Para poder usar __dirname com ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
);

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/mangas', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        'includes[]': ['author', 'artist', 'cover_art'],
        'order[latestUploadedChapter]': 'desc',
        ...req.query,
      },
    });

    const mangas = response.data.data;

    const enriched = mangas.map((manga) => {
      const relationships = manga.relationships || [];

      const cover = relationships.find((rel) => rel.type === 'cover_art');
      const author = relationships.find((rel) => rel.type === 'author');
      const artist = relationships.find((rel) => rel.type === 'artist');

      const coverFileName = cover?.attributes?.fileName;
      const coverUrl = coverFileName
        ? `${BASE_IMAGE_URL}/covers/${manga.id}/${coverFileName}.256.jpg`
        : null;

      return {
        id: manga.id,
        type: manga.type,
        attributes: manga.attributes,
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
