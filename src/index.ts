import { Client, LocalAuth, Message, MessageMedia, Chat } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import PDFDocument from 'pdfkit';

console.log("🚀 Iniciando o Motor do Chatbot ArtGlass Soluções (Com Anti-Spam Sênior & State Lock)...");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas', '--no-first-run', '--disable-gpu',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        ]
    }
});

client.on('qr', (qr: string) => {
    console.log('📱 Escaneie o QR Code abaixo com o seu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Chatbot ArtGlass conectado e pronto para uso!');
});

client.on('auth_failure', (msg: string) => {
    console.error('❌ Falha na autenticação:', msg);
});

// ---------------------------------------------------------
// 1. CÉREBRO: SYSTEM PROMPT DA LLM (Para uso futuro)
// ---------------------------------------------------------
export const LLM_SYSTEM_PROMPT = `
Você é um assistente virtual de atendimento via WhatsApp da ArtGlass Soluções. 
REGRAS OBRIGATÓRIAS:
1. NUNCA use formatação markdown (sem asteriscos para negrito, sem sublinhados).
2. Responda em no máximo 2 parágrafos curtos.
3. Comporte-se como um humano digitando pelo celular. Tom de voz natural e direto.
`;

// ---------------------------------------------------------
// ESTRUTURAS DE DADOS (SESSÃO + ORÇAMENTO)
// ---------------------------------------------------------
interface SessaoUsuario {
    estado: string;
    contadorMensagens: number;
    ultimaMensagem: number;
    isProcessing: boolean; // [NOVO] Mutex - Trava de estado para evitar Race Conditions
    nomeCliente?: string;
    servicoEscolhido?: string;
    largura?: number;
    altura?: number;
    tipoVidro?: string;
    precoM2?: number;
    comInstalacao?: boolean;
}

const userStates: Map<string, SessaoUsuario> = new Map();
const NUMERO_ATENDENTE = '5571987772415@c.us'; 

const servicosMap: { [key: string]: string } = {
    '1': 'Envidraçamento de sacadas', '2': 'Instalação de espelhos',
    '3': 'Instalação de janelas', '4': 'Portas basculantes',
    '5': 'Box de banheiro', '6': 'Manutenção e reformas'
};

// ---------------------------------------------------------
// REGRAS DE CONTENÇÃO (ANTI-SPAM & HORÁRIOS)
// ---------------------------------------------------------
function isSilentHour(): boolean {
    const currentHour = new Date().getHours();
    return currentHour >= 0 && currentHour < 6; // Bloqueia das 00:00 às 05:59
}

function pareceMensagemDeBot(texto: string): boolean {
    const gatilhosBot = ['digite um número', 'opção inválida', 'atendimento virtual', 'sou o assistente', 'menu principal', 'não entendi'];
    return gatilhosBot.some(gatilho => texto.includes(gatilho));
}

function querFalarComHumano(texto: string): boolean {
    const gatilhos = ['falar com humano', 'falar com atendente', 'atendente', 'humano', 'suporte'];
    return gatilhos.some(gatilho => texto.includes(gatilho));
}

// ---------------------------------------------------------
// SERVIÇO: ENVIO HUMANIZADO (Delay + "Digitando...")
// ---------------------------------------------------------
async function enviarMensagemHumanizada(chat: Chat, texto: string): Promise<void> {
    const CHARS_PER_SECOND = 200 / 60; // ~3.3 caracteres por segundo
    const baseDelayMs = (texto.length / CHARS_PER_SECOND) * 1000;
    const randomVariance = Math.floor(Math.random() * 1000) + 500;
    const finalDelayMs = Math.min(baseDelayMs + randomVariance, 8000); // Teto máximo de 8 segundos

    await chat.sendStateTyping(); // Mostra "Digitando..."
    await new Promise(resolve => setTimeout(resolve, finalDelayMs)); // Sleep
    await chat.clearState(); // Para de digitar
    await chat.sendMessage(texto); // Envia
}

// ---------------------------------------------------------
// FUNÇÕES DE NEGÓCIO (Cálculo e PDF)
// ---------------------------------------------------------
function calcularOrcamento(dados: SessaoUsuario): number {
    const area = (dados.largura || 0) * (dados.altura || 0);
    let total = area * (dados.precoM2 || 0);
    if (dados.comInstalacao) total += (area * 150); 
    return total;
}

async function gerarPDFBase64(dados: SessaoUsuario, valorTotal: number, numeroCliente: string): Promise<string> {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers: any[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers).toString('base64')));

        const areaTotal = ((dados.largura || 0) * (dados.altura || 0)).toFixed(2);
        doc.fontSize(24).text('ArtGlass Soluções', { align: 'center' });
        doc.fontSize(12).text('Pré-Orçamento Interno', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(14).text(`Cliente: ${dados.nomeCliente || 'Não informado'}`);
        doc.text(`WhatsApp: ${numeroCliente}`);
        doc.text(`Serviço Solicitado: ${dados.servicoEscolhido || 'Não especificado'}`);
        doc.moveDown();
        doc.fontSize(12).text(`Medidas: ${dados.largura}m x ${dados.altura}m`);
        doc.text(`Área Total: ${areaTotal} m²`);
        doc.text(`Especificação do Vidro: ${dados.tipoVidro}`);
        doc.moveDown();
        doc.fontSize(16).text(`Custo Base Estimado: R$ ${valorTotal.toFixed(2)}`, { align: 'right' });
        doc.end();
    });
}

// ---------------------------------------------------------
// SERVIÇO DE DEBOUNCE E INTERCEPTAÇÃO
// ---------------------------------------------------------
const messageBuffer = new Map<string, { timer: NodeJS.Timeout, textos: string[], chat: Chat }>();

client.on('message_create', async (msg: Message) => {
    // 1. ISOLAMENTO ABSOLUTO: Early Returns estritos
    if (!msg.body) return;
    if (msg.fromMe) return; // Ignora tudo que o bot enviar
    if (msg.from === 'status@broadcast' || msg.to === 'status@broadcast') return; // Ignora status
    if (msg.from.endsWith('@g.us') || msg.to.endsWith('@g.us')) return; // Ignora grupos

    const chat = await msg.getChat();
    if (chat.isGroup) return; // Validação dupla para grupos

    // 2. Time Block (Madrugada)
    if (isSilentHour()) {
        console.log(`🌙 Mensagem de ${msg.from} ignorada (Horário de Silêncio).`);
        return; 
    }

    const remetente = msg.from.replace(/:[0-9]+/, '');

    // 3. MUTEX/STATE LOCK (Evita Race Conditions e atropelamentos de menu)
    const sessaoAtual = userStates.get(remetente);
    if (sessaoAtual && sessaoAtual.isProcessing) {
        console.log(`🔒 [MUTEX] Mensagem ignorada. Bot já está processando/digitando para: ${remetente}`);
        return; // Retorna imediatamente sem colocar no debounce
    }

    console.log(`\n📩 RECEBIDO: "${msg.body}" | De: ${remetente}`);

    // 4. Lógica de Debounce (Agrupa mensagens enviadas em um intervalo de 5s)
    const tempoDebounce = 5000;
    if (messageBuffer.has(remetente)) {
        const buffer = messageBuffer.get(remetente)!;
        clearTimeout(buffer.timer);
        buffer.textos.push(msg.body);
        buffer.timer = setTimeout(() => processarFluxoFinal(remetente, buffer.textos.join(' '), chat), tempoDebounce);
    } else {
        const timer = setTimeout(() => processarFluxoFinal(remetente, msg.body, chat), tempoDebounce);
        messageBuffer.set(remetente, { timer, textos: [msg.body], chat });
    }
});

// ---------------------------------------------------------
// MOTOR DE RESPOSTAS E FLUXO PRINCIPAL
// ---------------------------------------------------------
async function processarFluxoFinal(numeroCliente: string, textoAgrupado: string, chat: Chat) {
    messageBuffer.delete(numeroCliente); // Limpa o buffer
    const textoMensagem = textoAgrupado.toLowerCase().trim();
    
    if (pareceMensagemDeBot(textoMensagem)) return;

    const agora = Date.now();
    let sessao = userStates.get(numeroCliente) || {
        estado: 'INICIO', contadorMensagens: 0, ultimaMensagem: agora, isProcessing: false
    };

    // 5. STRICT REACTIVE MODE: Fica em silêncio absoluto até a palavra certa
    if (['FINALIZADO', 'BLOQUEADO_POR_LOOP', 'ATENDIMENTO_HUMANO'].includes(sessao.estado)) {
        const palavrasDesbloqueio = ['menu', 'novo orçamento', 'oi', 'olá', 'ola'];
        if (palavrasDesbloqueio.some(p => textoMensagem.includes(p))) {
            sessao.estado = 'INICIO';
        } else {
            console.log(`🔇 [SILÊNCIO ABSOLUTO] Cliente ${numeroCliente} em estado ${sessao.estado}. Mensagem ignorada.`);
            return; // Interrompe o fluxo completamente. Nenhuma resposta é dada.
        }
    }

    // Trava anti-spam (excesso de interações em janela curta)
    const tempoDecorrido = agora - sessao.ultimaMensagem;
    if (tempoDecorrido < 15000) sessao.contadorMensagens += 1;
    else sessao.contadorMensagens = 1;
    sessao.ultimaMensagem = agora;

    if (sessao.contadorMensagens > 6) {
        console.log(`🛑 [ANTI-SPAM] Bloqueando ${numeroCliente} por excesso de interações.`);
        sessao.estado = 'BLOQUEADO_POR_LOOP';
        sessao.isProcessing = false;
        userStates.set(numeroCliente, sessao);
        return; 
    }

    // APLICANDO O STATE LOCK (Tranca a sessão para processamento)
    sessao.isProcessing = true;
    userStates.set(numeroCliente, sessao);

    try {
        if (querFalarComHumano(textoMensagem)) {
            await enviarMensagemHumanizada(chat, `Vou chamar um atendente agora mesmo para continuar o seu atendimento. 😊\n\nUm momento, por favor! ⏳`);
            client.sendMessage(NUMERO_ATENDENTE, `🔔 *ATENÇÃO!*\n\nO cliente *${sessao.nomeCliente || numeroCliente}* pediu suporte humano.`);
            sessao.estado = 'ATENDIMENTO_HUMANO';
            return; // O fluxo vai para o 'finally' desativar a trava
        }

        // Máquina de Estados
        switch (sessao.estado) {
            case 'INICIO':
                await enviarMensagemHumanizada(chat, `Olá, seja bem-vindo! 🛠️\n\nOi, eu sou um ChatBot da *ArtGlass Soluções*.\n\nPara começar, por favor, digite o seu *Nome e Sobrenome*.`);
                sessao.estado = 'AGUARDANDO_NOME';
                break;

            case 'AGUARDANDO_NOME':
                sessao.nomeCliente = textoAgrupado; 
                await enviarMensagemHumanizada(chat, `Perfeito, ${sessao.nomeCliente}! 📝\n\nQual destas opções você gostaria de solicitar hoje? Digite o *número*:\n\n1️⃣ - Envidraçamento de sacadas\n2️⃣ - Instalação de espelhos\n3️⃣ - Instalação de janelas\n4️⃣ - Portas basculantes\n5️⃣ - Box de banheiro\n6️⃣ - Manutenção e reformas`);
                sessao.estado = 'ESCOLHENDO_SERVICO';
                break;

            case 'ESCOLHENDO_SERVICO':
                if (servicosMap[textoMensagem]) {
                    sessao.servicoEscolhido = servicosMap[textoMensagem]; 
                    await enviarMensagemHumanizada(chat, `Excelente escolha! 📏\n\nVocê já tem as medidas aproximadas?\n\nResponda com:\n*SIM* (para enviar as medidas)\n*NÃO* (para agendarmos visita técnica)`);
                    sessao.estado = 'PERGUNTANDO_TEM_MEDIDAS';
                } else {
                    await enviarMensagemHumanizada(chat, `Por favor, digite um número válido de *1 a 6*. 😊`);
                }
                break;

            case 'PERGUNTANDO_TEM_MEDIDAS':
                if (textoMensagem.includes('sim')) {
                    await enviarMensagemHumanizada(chat, `Ótimo! Por favor, digite a *largura* e a *altura* do espaço (ex: *2 e 1.5*). 📐`);
                    sessao.estado = 'COLETANDO_MEDIDAS_EXATAS';
                } else if (textoMensagem.includes('não') || textoMensagem.includes('nao')) {
                    await enviarMensagemHumanizada(chat, `Sem problemas! Podemos agendar uma visita técnica.\n\nNossa equipe entrará em contato em breve. ⏳`);
                    client.sendMessage(NUMERO_ATENDENTE, `📅 *VISITA TÉCNICA!*\nCliente: ${sessao.nomeCliente}\nContato: ${numeroCliente}\nServiço: ${sessao.servicoEscolhido}`);
                    sessao.estado = 'FINALIZADO'; 
                } else {
                    await enviarMensagemHumanizada(chat, `Por favor, responda apenas com *SIM* ou *NÃO*.`);
                }
                break;

            case 'COLETANDO_MEDIDAS_EXATAS':
                const medidas = textoMensagem.match(/\d+[.,]?\d*/g); 
                if (medidas && medidas.length >= 2) {
                    sessao.largura = parseFloat(medidas[0].replace(',', '.'));
                    sessao.altura = parseFloat(medidas[1].replace(',', '.'));
                    await enviarMensagemHumanizada(chat, `Medidas anotadas! 📏\n\nQual tipo de vidro? Digite o *número*:\n\n1️⃣ Comum (4mm a 6mm)\n2️⃣ Temperado Incolor (6mm)\n3️⃣ Temperado Fumê/Verde (8mm)\n4️⃣ Temperado Jateado/Refletivo (10-12mm)`);
                    sessao.estado = 'ESCOLHENDO_TIPO_VIDRO';
                } else {
                    await enviarMensagemHumanizada(chat, `Não consegui entender as medidas. Digite os números (ex: *2 e 1.5*).`);
                }
                break;

            case 'ESCOLHENDO_TIPO_VIDRO':
                let valido = true;
                if (textoMensagem === '1') { sessao.tipoVidro = 'Comum'; sessao.precoM2 = 120; }
                else if (textoMensagem === '2') { sessao.tipoVidro = 'Temperado Incolor'; sessao.precoM2 = 215; }
                else if (textoMensagem === '3') { sessao.tipoVidro = 'Temperado Fumê/Verde'; sessao.precoM2 = 300; }
                else if (textoMensagem === '4') { sessao.tipoVidro = 'Temperado Jateado'; sessao.precoM2 = 400; }
                else { valido = false; await enviarMensagemHumanizada(chat, `Opção inválida. Digite de *1 a 4*.`); }

                if (valido) {
                    await enviarMensagemHumanizada(chat, `Quase lá! ⚙️\n\nO serviço precisa incluir a *instalação*?\nResponda com *SIM* ou *NÃO*.`);
                    sessao.estado = 'AGUARDANDO_INSTALACAO';
                }
                break;

            case 'AGUARDANDO_INSTALACAO':
                if (textoMensagem.includes('sim')) sessao.comInstalacao = true; 
                else if (textoMensagem.includes('nao') || textoMensagem.includes('não')) sessao.comInstalacao = false; 
                else { await enviarMensagemHumanizada(chat, `Responda apenas com *SIM* ou *NÃO*.`); return; }

                await enviarMensagemHumanizada(chat, `Tudo anotado, ${sessao.nomeCliente}! 📋\n\nJá enviei os seus dados para nossa equipe. O orçamento chegará em instantes.`);

                console.log(`\n⚙️ Gerando PDF...`);
                const valorEstimado = calcularOrcamento(sessao);
                const pdfBase64 = await gerarPDFBase64(sessao, valorEstimado, numeroCliente);
                const mediaPDF = new MessageMedia('application/pdf', pdfBase64, `Orcamento_${sessao.nomeCliente?.replace(/ /g, '_')}.pdf`);
                
                try {
                    await chat.sendStateTyping();
                    await new Promise(r => setTimeout(r, 4000));
                    
                    await client.sendMessage(numeroCliente, `Aqui está uma estimativa do seu projeto:`);
                    await client.sendMessage(numeroCliente, mediaPDF);
                    client.sendMessage(NUMERO_ATENDENTE, `🚨 *NOVO LEAD*\nCliente: ${sessao.nomeCliente}\nContato: ${numeroCliente}\nOrçamento: R$ ${valorEstimado.toFixed(2)}`);
                } catch (e) {
                    console.error("❌ Erro ao enviar PDF:", e);
                }

                sessao.estado = 'FINALIZADO'; 
                break;
        }
    } finally {
        // LIBERANDO O STATE LOCK (Executado incondicionalmente, mesmo que ocorra um erro no try)
        sessao.isProcessing = false;
        userStates.set(numeroCliente, sessao);
    }
}

client.initialize();