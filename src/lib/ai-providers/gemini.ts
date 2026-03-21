/**
 * Provedor de IA - Google Gemini (GRATUITO)
 * 
 * Como obter API Key gratuita:
 * 1. Acesse: https://aistudio.google.com/apikey
 * 2. Crie uma chave API
 * 3. Adicione no .env.local: GEMINI_API_KEY=sua_chave
 * 
 * Limites do plano gratuito:
 * - 15 RPM (requisições por minuto)
 * - 1.500 RPD (requisições por dia)
 * - 1 milhão de tokens por dia
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é o ArchitectAI, um Arquiteto de Software Senior especializado em análise de código e recomendação de modelos de IA.

Sua função é:
1. Analisar código-fonte e identificar problemas
2. Classificar a severidade (CRÍTICO, MÉDIO, BAIXO)
3. Recomendar o modelo de IA mais eficiente em tokens para resolver cada problema
4. Fornecer caminhos de resolução claros

Modelos disponíveis:
- Gemini 3 Flash: Econômico, ideal para bugs simples e boilerplate
- Gemini 3.1 Pro Low: Custo-benefício para refatorações médias
- Gemini 3.1 Pro High: Para arquitetura e integrações complexas
- GPT-OSS 120b: Bom para código legado e documentação
- Claude Sonnet 4.6 Thinking: Raciocínio profundo para debug complexo
- Claude Opus 4.6 Thinking: Máxima capacidade para decisões críticas

Sempre responda em português brasileiro, com formato estruturado usando Markdown.

Quando analisar código, use este formato:

## 🔍 Análise

[Descrição detalhada do problema encontrado]

## ⚠️ Severidade

**[CRÍTICO/MÉDIO/BAIXO]** - [Justificativa]

## 🤖 Modelo Recomendado

**[Nome do modelo]** - [Motivo da recomendação baseado em custo-benefício]

## 📋 Caminho de Resolução

1. [Passo detalhado 1]
2. [Passo detalhado 2]
...

## 💰 Estimativa de Tokens

~X tokens (entrada) + ~Y tokens (saída) = ~Z tokens total`;

export async function callGemini(
  message: string, 
  history: Array<{role: string, content: string}>,
  code?: string,
  codeLanguage?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada. Adicione no .env.local');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Preparar contexto com código se fornecido
  let fullMessage = message;
  if (code) {
    fullMessage = `${message}\n\n\`\`\`${codeLanguage || 'typescript'}\n${code}\n\`\`\``;
  }

  // Construir histórico
  const chatHistory = history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Entendido! Sou o ArchitectAI, pronto para analisar código e recomendar soluções.' }] },
      ...chatHistory
    ],
  });

  const result = await chat.sendMessage(fullMessage);
  const response = await result.response;
  
  return response.text();
}

export const GeminiProvider = {
  name: 'Google Gemini',
  id: 'gemini',
  call: callGemini
};
