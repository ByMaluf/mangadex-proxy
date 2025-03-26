import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const BASE_URL = 'https://api.mangadex.org';
const BASE_IMAGE_URL = 'https://uploads.mangadex.org';

app.use(cors());

// Buscar todos os mangás com filtros e paginação
app.get('/mangas', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar todos os mangás:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar todos os mangás' });
  }
});

// Buscar mangá por título
app.get('/search', async (req, res) => {
  const { title } = req.query;
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: { title }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar mangá por título:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar mangá por título' });
  }
});

// Buscar detalhes de um mangá por ID
app.get('/manga/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/manga/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar mangá por ID:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar mangá por ID' });
  }
});

// Buscar nome de arquivo da capa pelo ID da capa
app.get('/cover/:coverId', async (req, res) => {
  const { coverId } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/cover/${coverId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar capa:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar capa' });
  }
});

// Montar URL da capa
app.get('/cover/url/:coverId/:fileName', (req, res) => {
  const { coverId, fileName } = req.params;
  const imageUrl = `${BASE_IMAGE_URL}/covers/${coverId}/${fileName}.256.jpg`;
  res.json({ url: imageUrl });
});

// Listar capítulos por mangá
app.get('/chapters/:mangaId', async (req, res) => {
  const { mangaId } = req.params;
  const { page = 0, order = 'asc', language = 'en' } = req.query;

  try {
    const response = await axios.get(`${BASE_URL}/chapter`, {
      params: {
        manga: mangaId,
        'translatedLanguage[]': language,
        'order[chapter]': order,
        includeEmptyPages: 0,
        limit: 96,
        offset: page
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar capítulos:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar capítulos' });
  }
});

// Capítulos agregados por volume
app.get('/volumes/:mangaId', async (req, res) => {
  const { mangaId } = req.params;
  const { language = 'en' } = req.query;
  try {
    const response = await axios.get(`${BASE_URL}/manga/${mangaId}/aggregate`, {
      params: { 'translatedLanguage[]': language }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar capítulos agregados:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar capítulos agregados' });
  }
});

// Dados da imagem de um capítulo
app.get('/chapter/:chapterId/images', async (req, res) => {
  const { chapterId } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar imagens do capítulo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar imagens do capítulo' });
  }
});

// URL da imagem de um capítulo
app.get('/chapter/image/:hash/:fileName', (req, res) => {
  const { hash, fileName } = req.params;
  const imageUrl = `${BASE_IMAGE_URL}/data/${hash}/${fileName}`;
  res.json({ url: imageUrl });
});

// Página inicial
app.get('/', (req, res) => {
  res.send('Proxy MangaDex funcionando!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
