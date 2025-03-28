module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Mangadex Proxy API",
    version: "1.0.0",
    description: "Proxy para a API do MangaDex com dados enriquecidos"
  },
  servers: [
    {
      url: "https://mangadex-proxy-seven.vercel.app",
      description: "Servidor Vercel"
    }
  ],
  paths: {
    "/mangas": {
      get: {
        summary: "Retorna todos os mangás com dados enriquecidos",
        parameters: [
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer"
            },
            description: "Quantidade de mangás a retornar"
          },
          {
            in: "query",
            name: "offset",
            schema: {
              type: "integer"
            },
            description: "Offset da paginação"
          }
        ],
        responses: {
          200: {
            description: "Lista de mangás com dados adicionais",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    result: {
                      type: "string"
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
