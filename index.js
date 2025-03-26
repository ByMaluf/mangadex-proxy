app.get('/mangas', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit,
        offset,
        'includes[]': ['author', 'artist', 'cover_art'],
        'order[latestUploadedChapter]': 'desc',
      },
    });

    const mangas = response.data.data;

    const enriched = await Promise.all(
      mangas.map(async (manga) => {
        const coverRel = manga.relationships.find((rel) => rel.type === 'cover_art');
        const authorRel = manga.relationships.find((rel) => rel.type === 'author');
        const artistRel = manga.relationships.find((rel) => rel.type === 'artist');

        let fileName = null;

        if (coverRel) {
          try {
            const coverResponse = await axios.get(`${BASE_URL}/cover/${coverRel.id}`);
            fileName = coverResponse.data.data.attributes.fileName;
          } catch (err) {
            console.error('Erro ao buscar a capa:', err.message);
          }
        }

        return {
          id: manga.id,
          title: manga.attributes.title,
          altTitles: manga.attributes.altTitles,
          description: manga.attributes.description,
          status: manga.attributes.status,
          contentRating: manga.attributes.contentRating,
          tags: manga.attributes.tags,
          publicationDemographic: manga.attributes.publicationDemographic,
          originalLanguage: manga.attributes.originalLanguage,
          lastVolume: manga.attributes.lastVolume,
          lastChapter: manga.attributes.lastChapter,
          year: manga.attributes.year,
          createdAt: manga.attributes.createdAt,
          updatedAt: manga.attributes.updatedAt,
          author: authorRel?.attributes?.name || null,
          artist: artistRel?.attributes?.name || null,
          imageUrl: fileName
            ? `${BASE_IMAGE_URL}/covers/${manga.id}/${fileName}.256.jpg`
            : null,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error('Erro ao buscar mangás completos:', error);
    res.status(500).json({ error: 'Erro ao buscar mangás completos' });
  }
});
