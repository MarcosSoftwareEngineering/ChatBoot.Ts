# 🤖 WhatsApp Chatbot - TypeScript & Node.js

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![whatsapp-web.js](https://img.shields.io/badge/whatsapp--web.js-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

Um chatbot automatizado para WhatsApp, construído com arquitetura escalável utilizando Node.js, TypeScript e a biblioteca `whatsapp-web.js`. Focado em performance e código limpo para facilitar a manutenção e a adição de novas funcionalidades.

## 🚀 Tecnologias e Arquitetura

Este projeto foi desenvolvido utilizando as melhores práticas de Engenharia de Software, incluindo tipagem estática e modularização de código.

* **[Node.js](https://nodejs.org/):** Ambiente de execução.
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para maior previsibilidade e redução de bugs.
* **[whatsapp-web.js](https://wwebjs.dev/):** API baseada em web scraping do WhatsApp Web (via Puppeteer/Chromium).
* **[ts-node-dev](https://github.com/wclr/ts-node-dev) / [Nodemon]:** Live-reload para o ambiente de desenvolvimento.

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* **Node.js** (v18+ recomendado)
* **npm** ou **yarn**
* Uma conta ativa no WhatsApp (recomenda-se usar um número de testes)

## 🛠️ Instalação e Configuração

## 🛠️ Instalação e Configuração

**2. Instale as dependências:**
```bash
npm install

cp .env.example .env

npm run dev

npm run build
npm start

## 📱 Autenticação (Primeiro Acesso)
Na primeira vez que você rodar o projeto, o terminal irá gerar um **QR Code**.

1. Abra o WhatsApp no seu celular.
2. Vá em **Aparelhos Conectados** > **Conectar um aparelho**.
3. Escaneie o QR Code no terminal para autenticar a sessão.
> **Aviso:** As credenciais serão salvas na pasta `.wwebjs_auth`, que deve ser ignorada pelo git por questões de segurança.

## 📜 Scripts Disponíveis (`package.json`)
* `npm run dev`: Inicia o servidor em modo de desenvolvimento via TypeScript.
* `npm run build`: Transpila o código de TypeScript (`/src`) para JavaScript (na pasta de destino, ex: `/dist`).
* `npm start`: Inicia a aplicação já compilada para produção em Node.js puro.

## 🎯 Funcionalidades Atuais
- [x] Autenticação via QR Code no terminal.
- [x] Escuta de mensagens recebidas.
- [ ] Responder a comandos dinâmicos.

---

**Desenvolvido com dedicação e foco em Clean Code.**
🔗 [Portfólio](https://marcos-dev-zeta.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/marcos-vinicius-souza-silva-29025a294/) | [GitHub](https://github.com/MarcosSoftwareEngineering)

