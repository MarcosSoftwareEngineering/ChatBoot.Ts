# 🤖 WhatsApp Chatbot — Node.js & TypeScript

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![whatsapp-web.js](https://img.shields.io/badge/whatsapp--web.js-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wwebjs.dev/)

Um **chatbot automatizado para WhatsApp**, construído com **Node.js**, **TypeScript** e a biblioteca `whatsapp-web.js`.  
Projetado com foco em **performance**, **escalabilidade** e **código limpo**, facilitando manutenção e evolução.

---

## 🚀 Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/):** Ambiente de execução JavaScript.
- **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para maior segurança e previsibilidade.
- **[whatsapp-web.js](https://wwebjs.dev/):** API baseada no WhatsApp Web (via Puppeteer/Chromium).
- **[ts-node-dev](https://github.com/wclr/ts-node-dev)** / **Nodemon:** Live-reload para desenvolvimento ágil.

---

## ⚙️ Pré-requisitos

Antes de começar, garanta que você possui:

- **Node.js** (v18 ou superior recomendado)  
- **npm** ou **yarn**  
- Uma conta ativa no WhatsApp (preferencialmente um número de testes)

---

## 🛠️ Instalação e Configuração

1. Clone o repositório e acesse a pasta do projeto.  
2. Instale as dependências:

```bash
npm install
cp .env.example .env
Execute em modo desenvolvimento:
npm run dev

Para produção:
npm run build
npm start

📱 Autenticação (Primeiro Acesso)
Na primeira execução, será exibido um QR Code no terminal:

Abra o WhatsApp no celular.

Vá em Aparelhos Conectados → Conectar um aparelho.

Escaneie o QR Code para autenticar.

⚠️ As credenciais ficam salvas em .wwebjs_auth (não versionar no Git por segurança).

npm run dev   # Executa em modo desenvolvimento (TypeScript)
npm run build # Transpila o código para JavaScript (pasta /dist)
npm start     # Roda a versão compilada em produção
🎯 Funcionalidades
✅ Autenticação via QR Code

✅ Escuta de mensagens recebidas

⬜ Respostas dinâmicas a comandos
---

## 👨‍💻 Autor
Desenvolvido com dedicação e foco em Clean Code.  

[![Portfólio](https://img.shields.io/badge/Portfólio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://marcos-dev-zeta.vercel.app/)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marcos-vinicius-souza-silva-29025a294/)  
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MarcosSoftwareEngineering)

