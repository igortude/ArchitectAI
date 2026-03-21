/**
 * Provedor de IA - Anthropic Claude (PAGO)
 * 
 * Como obter API Key:
 * 1. Acesse: https://console.anthropic.com/
 * 2. Crie uma chave API (requer cadastro)
 * 3. Adicione no .env.local: ANTHROPIC_API_KEY=sua_chave
 * 
 * Preços aproximados:
 * - Claude 3.5 Sonnet: $3.00/1M input tokens, $15.00/1M output tokens
 * - Claude 3.5 Haiku: $0.80/1M input tokens, $4.00/1M output tokens
 */

import Anthropic from '@anthropic-ai/sdk';

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

export async function callAnthropic(
  message: string, 
  history: Array<{role: string, content: string}>,
  code?: string,
  codeLanguage?: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada. Adicione no .env.local');
  }

  const anthropic = new Anthropic({ apiKey });

  // Preparar contexto com código se fornecido
  let fullMessage = message;
  if (code) {
    fullMessage = `${message}\n\n\`\`\`${codeLanguage || 'typescript'}\n${code}\n\`\`\``;
  }

  // Construir mensagens
  const messages: Anthropic.Messages.MessageParam[] = [
    ...history.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
    { role: 'user', content: fullMessage }
  ];

  const completion = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022', // Mais econômico
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
  });

  const textBlock = completion.content.find(block => block.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : 'Desculpe, não consegui processar sua solicitação.';
}

export const AnthropicProvider = {
  name: 'Anthropic Claude',
  id: 'anthropic',
  call: callAnthropic
};
