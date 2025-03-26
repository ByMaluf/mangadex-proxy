import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/search', async (req, res) => {
  const { title } = req.query;

  try {
    const response = await fetch(`https://api.mangadex.org/search?title=${encodeURIComponent(title)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar no MangaDex' });
  }
});

app.get('/', (req, res) => {
  res.send('Proxy MangaDex funcionando! Use /search?title=algo');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
