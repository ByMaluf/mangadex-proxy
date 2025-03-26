app.get('/mangas', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: req.query.limit || 100,         // ou qualquer valor desejado
        offset: req.query.offset || 0,
        'includes[]': ['author', 'artist', 'cover_art'], // traz as relações
        'order[latestUploadedChapter]': 'desc', // ordenação
        ...req.query, // permite customização extra se quiser
      }
    });

    // Se você quiser os dados crus da API (com relationships etc.)
    res.json(response.data);

  } catch (error) {
    console.error('Erro ao buscar todos os mangás:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar todos os mangás' });
  }
});
