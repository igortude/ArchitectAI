/**
 * Provedor de IA - OpenAI (PAGO)
 * 
 * Como obter API Key:
 * 1. Acesse: https://platform.openai.com/api-keys
 * 2. Crie uma chave API (requer cadastro e cartão)
 * 3. Adicione no .env.local: OPENAI_API_KEY=sua_chave
 * 
 * Preços aproximados:
 * - GPT-4o: $2.50/1M input tokens, $10.00/1M output tokens
 * - GPT-4o-mini: $0.15/1M input tokens, $0.60/1M output tokens
 */

import OpenAI from 'openai';

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

export async function callOpenAI(
  message: string, 
  history: Array<{role: string, content: string}>,
  code?: string,
  codeLanguage?: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada. Adicione no .env.local');
  }

  const openai = new OpenAI({ apiKey });

  // Preparar contexto com código se fornecido
  let fullMessage = message;
  if (code) {
    fullMessage = `${message}\n\n\`\`\`${codeLanguage || 'typescript'}\n${code}\n\`\`\``;
  }

  // Construir mensagens
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
    { role: 'user', content: fullMessage }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Mais econômico
    messages,
    max_tokens: 4096,
  });

  return completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';
}

export const OpenAIProvider = {
  name: 'OpenAI',
  id: 'openai',
  call: callOpenAI
};
