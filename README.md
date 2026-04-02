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

**1. Clone o repositório:**
```bash
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
cd NOME_DO_REPOSITORIO

2. Instale as dependências:

npm install

3. Configure o ambiente de desenvolvimento:
(Se o seu projeto usar um arquivo .env, explique aqui como copiá-lo. Ex: cp .env.example .env)
💻 Como Rodar o Projeto
Ambiente de Desenvolvimento
Para iniciar o projeto com recarregamento automático (ideal para codar):

npm run dev

Ambiente de Produção

Para compilar o TypeScript e rodar a versão otimizada em JavaScript:

npm run build
npm start

📱 Autenticação (Primeiro Acesso)
Na primeira vez que você rodar o projeto, o terminal irá gerar um QR Code.

Abra o WhatsApp no seu celular.

Vá em Aparelhos Conectados > Conectar um aparelho.

Escaneie o QR Code no terminal para autenticar a sessão. As credenciais serão salvas na pasta (ignorada pelo git) .wwebjs_auth.

📜 Scripts Disponíveis (package.json)
npm run dev: Inicia o servidor em modo de desenvolvimento.

npm run build: Transpila o código de TypeScript (/src) para JavaScript (na pasta de destino, ex: /dist).

npm start: Inicia a aplicação já compilada para produção.

🎯 Funcionalidades Atuais
[x] Autenticação via QR Code no terminal.

[x] Escuta de mensagens recebidas.

[ ] Responder a comandos específicos (ex: !ping, !ajuda). (Edite com as suas funções reais)

Desenvolvido com dedicação e foco em Clean Code.
🔗 Meu Portfólio / LinkedIn

Markdown
**2. Instale as dependências:**
```bash
npm install
3. Configure o ambiente de desenvolvimento:
(Se o seu projeto usar variáveis de ambiente, crie o arquivo baseado no exemplo)

Bash
cp .env.example .env
💻 Como Rodar o Projeto
Ambiente de Desenvolvimento
Para iniciar o projeto com recarregamento automático (ideal para codar):

Bash
npm run dev
(Nota: Certifique-se de que o script "dev": "ts-node src/index.ts" ou similar esteja configurado no seu package.json)

Ambiente de Produção
Para compilar o TypeScript e rodar a versão otimizada em JavaScript:

Bash
npm run build
npm start
📱 Autenticação (Primeiro Acesso)
Na primeira vez que você rodar o projeto, o terminal irá gerar um QR Code.

Abra o WhatsApp no seu celular.

Vá em Aparelhos Conectados > Conectar um aparelho.

Escaneie o QR Code no terminal para autenticar a sessão.

Aviso: As credenciais serão salvas na pasta .wwebjs_auth, que deve ser ignorada pelo git por questões de segurança.

📜 Scripts Disponíveis (package.json)
npm run dev: Inicia o servidor em modo de desenvolvimento via TypeScript.

npm run build: Transpila o código de TypeScript (/src) para JavaScript (na pasta de destino, ex: /dist).

npm start: Inicia a aplicação já compilada para produção em Node.js puro.

🎯 Funcionalidades Atuais
[x] Autenticação via QR Code no terminal.

[x] Escuta de mensagens recebidas.

[ ] Responder a comandos dinâmicos.

Desenvolvido com dedicação e foco em Clean Code.
🔗 Portfólio | LinkedIn | GitHub
