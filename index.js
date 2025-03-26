import express from 'express';
import axios from 'axios';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
app.use(cors());

const BASE_URL = 'https://api.mangadex.org';
const BASE_IMAGE_URL = 'https://uploads.mangadex.org';

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mangadex Proxy API',
      version: '1.0.0',
      description: 'Proxy para a API do MangaDex com dados enriquecidos',
    },
    servers: [
      {
        url: 'https://mangadex-proxy-seven.vercel.app',
        description: 'Servidor Vercel',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /mangas:
 *   get:
 *     summary: Retorna todos os mangás com dados enriquecidos
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade de mangás a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset da paginação
 *     responses:
 *       200:
 *         description: Lista de mangás com dados adicionais
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

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