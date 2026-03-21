/**
 * Provedor de IA - Modo Demo (sem API)
 * 
 * Este provedor é usado quando nenhuma API key está configurada.
 * Retorna respostas simuladas para demonstração da interface.
 */

export async function callDemo(
  message: string, 
  history: Array<{role: string, content: string}>,
  code?: string,
  codeLanguage?: string
): Promise<string> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Detectar tipo de pergunta e responder adequadamente
  const lowerMessage = message.toLowerCase();
  
  if (code) {
    return generateCodeAnalysisResponse(message, code, codeLanguage);
  }
  
  if (lowerMessage.includes('bug') || lowerMessage.includes('erro') || lowerMessage.includes('problema')) {
    return generateBugResponse();
  }
  
  if (lowerMessage.includes('performance') || lowerMessage.includes('otimizar') || lowerMessage.includes('lento')) {
    return generatePerformanceResponse();
  }
  
  if (lowerMessage.includes('arquitetura') || lowerMessage.includes('estrutura') || lowerMessage.includes('design')) {
    return generateArchitectureResponse();
  }
  
  return generateGeneralResponse();
}

function generateCodeAnalysisResponse(message: string, code: string, language?: string): string {
  const lines = code.split('\n').length;
  const lang = language || 'código';
  
  return `## 🔍 Análise do Código

Analisei seu código em **${lang}** com ${lines} linhas.

### Observações Gerais

O código apresentado foi analisado quanto a:
- Estrutura e organização
- Possíveis bugs e vulnerabilidades
- Performance e otimizações
- Boas práticas de programação

## ⚠️ Severidade

**MÉDIO** - Código funcional, mas com pontos de melhoria identificados.

## 🤖 Modelo Recomendado

**Gemini 3 Flash** - Para análise inicial e sugestões rápidas, este modelo econômico é ideal. Para refatorações mais complexas, considere Gemini 3.1 Pro High.

## 📋 Caminho de Resolução

1. **Revise a estrutura** - Verifique se o código segue os princípios SOLID
2. **Adicione tratamento de erros** - Implemente try/catch onde necessário
3. **Documente funções** - Adicione comentários JSDoc/TSDoc
4. **Considere testes** - Implemente testes unitários para funções críticas

## 💰 Estimativa de Tokens

~${Math.ceil(code.length / 4)} tokens (entrada) + ~500 tokens (saída) = ~${Math.ceil(code.length / 4) + 500} tokens total

---

⚠️ **Modo Demo**: Configure uma API key real para análise completa do código. Veja o arquivo README.md para instruções.`;
}

function generateBugResponse(): string {
  return `## 🔍 Análise de Bugs

Para identificar bugs de forma eficaz, preciso que você:

1. **Compartilhe o código** - Cole o código problemático
2. **Descreva o erro** - Mensagem de erro ou comportamento inesperado
3. **Contexto** - Quando o erro ocorre

## 🤖 Modelo Recomendado

**Claude Sonnet 4.6 Thinking** - Excelente para debug complexo, consegue analisar fluxos de execução e identificar bugs sutis.

## 📋 Próximos Passos

1. Cole o código no chat
2. Descreva o problema
3. Receberá análise detalhada

---

⚠️ **Modo Demo**: Configure uma API key real para detecção avançada de bugs.`;
}

function generatePerformanceResponse(): string {
  return `## 🔍 Análise de Performance

Para otimizar performance, considere:

### Áreas Comuns de Otimização

1. **Algoritmos** - Complexidade O(n²) pode ser reduzida
2. **Consultas DB** - Adicione índices, use paginação
3. **Caching** - Implemente Redis para dados frequentes
4. **Lazy Loading** - Carregue recursos sob demanda

## 🤖 Modelo Recomendado

**Gemini 3.1 Pro High** - Ideal para análise arquitetural e sugestões de otimização complexas.

## 📋 Caminho de Resolução

1. Identifique gargalos com profiling
2. Priorize otimizações por impacto
3. Implemente mudanças incrementais
4. Meça resultados após cada mudança

---

⚠️ **Modo Demo**: Configure uma API key real para análise de performance personalizada.`;
}

function generateArchitectureResponse(): string {
  return `## 🔍 Análise Arquitetural

Como Arquiteto de Software, posso ajudá-lo com:

### Padrões de Arquitetura

- **MVC** - Separação de responsabilidades
- **Clean Architecture** - Independência de frameworks
- **Microserviços** - Escalabilidade e independência
- **Event-Driven** - Desacoplamento assíncrono

## 🤖 Modelo Recomendado

**Claude Opus 4.6 Thinking** - Para decisões arquiteturais críticas que impactam todo o sistema.

## 📋 Próximos Passos

1. Descreva seu projeto atual
2. Explique os requisitos
3. Receberá recomendações arquiteturais

---

⚠️ **Modo Demo**: Configure uma API key real para consultoria arquitetural completa.`;
}

function generateGeneralResponse(): string {
  return `## 🔍 ArchitectAI - Assistente de Arquitetura

Olá! Sou o ArchitectAI, seu Arquiteto de Software Senior.

### Como posso ajudar:

1. **Análise de Código** - Cole código para análise completa
2. **Identificação de Bugs** - Descreva problemas para diagnosticar
3. **Otimização** - Sugestões de performance
4. **Arquitetura** - Consultoria de design de software
5. **Recomendação de Modelos** - Escolha o modelo IA mais eficiente

### Modelos Disponíveis

| Modelo | Tier | Melhor Para |
|--------|------|-------------|
| Gemini 3 Flash | Econômico | Bugs simples, boilerplate |
| Gemini 3.1 Pro Low | Econômico | Refatorações médias |
| Gemini 3.1 Pro High | Médio | Arquitetura, integrações |
| GPT-OSS 120b | Médio | Código legado, docs |
| Claude Sonnet 4.6 | Premium | Debug complexo, ML |
| Claude Opus 4.6 | Premium | Decisões críticas |

---

⚠️ **Modo Demo**: Configure uma API key para análise completa. Veja README.md para instruções.`;
}

export const DemoProvider = {
  name: 'Demo (sem API)',
  id: 'demo',
  call: callDemo
};
