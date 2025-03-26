# MangaDex Proxy API

Este projeto é um **proxy público e gratuito** para a API oficial do [MangaDex](https://api.mangadex.org), desenvolvido com **Node.js + Express**, utilizando **Axios** para as requisições HTTP e hospedado na **Vercel**.

## 🎯 Objetivo

A API do MangaDex não permite requisições diretas do navegador por conta da política de **CORS**. Este projeto resolve esse problema, permitindo:

- Requisições livres de CORS em aplicações front-end
- Consumo mais simples e controlado da API oficial
- Modularidade para evoluir em apps mais complexos (como o BitYomi)

> 🔧 Ideal para quem quer consumir mangás diretamente em aplicações front-end como React, Vue ou Angular.

---

## ⚙️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
- [Vercel](https://vercel.com/) (hospedagem serverless)

---

## 🌐 Endpoints Disponíveis

### 🔍 Buscar mangás por título

GET /search?title=solo

### 📚 Buscar lista de mangás com filtros

GET /mangas?limit=50&order[latestUploadedChapter]=desc

### 📖 Detalhes de um mangá por ID

GET /manga/:id

### 🖼️ Buscar capa por ID

GET /cover/:coverId

### 🧩 Montar URL da capa

GET /cover/url/:coverId/:fileName

### 📄 Listar capítulos por mangá

GET /chapters/:mangaId?page=0&order=asc&language=en

### 📦 Agregação de capítulos por volume

GET /volumes/:mangaId?language=en

### 🖼️ Dados de imagem do capítulo

GET /chapter/:chapterId/images

### 🌐 URL da imagem de um capítulo

GET /chapter/image/:hash/:fileName

---

## 🚀 Deploy

Deploy público feito na Vercel:

🔗 **https://mangadex-proxy-seven.vercel.app**

---

## 🧠 Por que criar esse proxy?

A API do MangaDex bloqueia requisições de navegadores comuns (por causa de CORS). Em vez de usar soluções temporárias ou instáveis, decidi criar um **proxy pessoal**, com os objetivos de:

- **Estudo prático** de REST API + CORS
- **Criação de base backend** para projetos front-end como o **BitYomi**
- **Facilitar o uso da MangaDex** em aplicações pessoais, portfólios ou side projects

---

## 👨‍💻 Autor

**Brenno Maluf**  
Dev full stack, criador do projeto **BitYomi** – um universo de leitura feito por e para desenvolvedores.  
Contato: [@bymaluf](https://github.com/bymaluf)

---

## 📄 Licença

MIT — Sinta-se livre para usar, contribuir ou adaptar ✌️
