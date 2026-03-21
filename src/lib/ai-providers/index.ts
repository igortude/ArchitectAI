/**
 * ArchitectAI - Gerenciador de Provedores de IA
 * 
 * Este módulo gerencia qual provedor de IA usar baseado nas variáveis de ambiente.
 * 
 * Para configurar um provedor, adicione a respectiva variável no .env.local:
 * - GEMINI_API_KEY=... (Gratuito - https://aistudio.google.com/apikey)
 * - OPENAI_API_KEY=... (Pago - https://platform.openai.com/api-keys)
 * - ANTHROPIC_API_KEY=... (Pago - https://console.anthropic.com/)
 * 
 * Se nenhuma key estiver configurada, usa modo Demo.
 */

import { DemoProvider } from './demo';

// Tipos
export interface AIProvider {
  name: string;
  id: string;
  call: (message: string, history: Array<{role: string, content: string}>, code?: string, codeLanguage?: string) => Promise<string>;
}

// Importar provedores condicionalmente
let GeminiProvider: AIProvider | null = null;
let OpenAIProvider: AIProvider | null = null;
let AnthropicProvider: AIProvider | null = null;

// Tentar carregar provedores
try {
  const gemini = require('./gemini');
  GeminiProvider = gemini.GeminiProvider;
} catch (e) {
  // Gemini SDK não instalado
}

try {
  const openai = require('./openai');
  OpenAIProvider = openai.OpenAIProvider;
} catch (e) {
  // OpenAI SDK não instalado
}

try {
  const anthropic = require('./anthropic');
  AnthropicProvider = anthropic.AnthropicProvider;
} catch (e) {
  // Anthropic SDK não instalado
}

/**
 * Retorna o provedor ativo baseado nas variáveis de ambiente
 */
export function getActiveProvider(): AIProvider {
  const env = process.env;
  
  // Prioridade: Gemini > OpenAI > Anthropic > Demo
  
  if (env.GEMINI_API_KEY && GeminiProvider) {
    return GeminiProvider;
  }
  
  if (env.OPENAI_API_KEY && OpenAIProvider) {
    return OpenAIProvider;
  }
  
  if (env.ANTHROPIC_API_KEY && AnthropicProvider) {
    return AnthropicProvider;
  }
  
  // Nenhum provedor configurado - usar demo
  return DemoProvider;
}

/**
 * Lista todos os provedores disponíveis
 */
export function listProviders(): Array<{id: string, name: string, configured: boolean, installed: boolean}> {
  return [
    {
      id: 'gemini',
      name: 'Google Gemini',
      configured: !!process.env.GEMINI_API_KEY,
      installed: !!GeminiProvider
    },
    {
      id: 'openai',
      name: 'OpenAI',
      configured: !!process.env.OPENAI_API_KEY,
      installed: !!OpenAIProvider
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      configured: !!process.env.ANTHROPIC_API_KEY,
      installed: !!AnthropicProvider
    },
    {
      id: 'demo',
      name: 'Demo (sem API)',
      configured: true,
      installed: true
    }
  ];
}

/**
 * Chama a IA com o provedor ativo
 */
export async function callAI(
  message: string, 
  history: Array<{role: string, content: string}>,
  code?: string,
  codeLanguage?: string
): Promise<{response: string, provider: string}> {
  const provider = getActiveProvider();
  
  const response = await provider.call(message, history, code, codeLanguage);
  
  return {
    response,
    provider: provider.name
  };
}

// Re-exportar provedores
export { DemoProvider };
export { GeminiProvider } from './gemini';
export { OpenAIProvider } from './openai';
export { AnthropicProvider } from './anthropic';
