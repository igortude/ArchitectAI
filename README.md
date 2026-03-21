# ArchitectAI - Arquiteto de Software Senior

Sistema de chatbot para análise de código e recomendação de modelos de IA. 

No final das contas, criado para ajudar a todos os que começaram com o Antigravity agora. Para não perder tokens tão rápidamente!

![ArchitectAI](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## 🚀 Funcionalidades

- 💬 **Chat Inteligente** - Interface de conversa com IA
- 📁 **Upload de Código** - Analise arquivos individuais
- 📦 **Análise de Projetos** - Upload de ZIP para análise completa
- 🤖 **Recomendação de Modelos** - Sugere o modelo mais eficiente em tokens
- 🌙 **Dark Mode** - Interface moderna com tema escuro
- 📱 **Responsivo** - Funciona em desktop e mobile

---

## ⚡ Início Rápido

### Pré-requisitos

- [Bun](https://bun.sh/) v1.0+ instalado
- Node.js 18+ (opcional, para compatibilidade)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/igortude/architect-ai.git
cd architect-ai

# Instale as dependências
bun install

# Configure a API (veja seção abaixo)
cp .env.example .env.local

# Rode o projeto
bun run dev
```

Acesse: http://localhost:3000

---

## 🔧 Configuração de API

O ArchitectAI suporta múltiplos provedores de IA. **Configure pelo menos um** para funcionalidade completa.

### Opção 1: Google Gemini (GRATUITO) ✅ Recomendado

```bash
# 1. Obtenha sua chave gratuita em:
#    https://aistudio.google.com/apikey

# 2. Adicione no .env.local:
GEMINI_API_KEY=sua_chave_aqui
```

**Limites gratuitos:**
- 15 requisições/minuto
- 1.500 requisições/dia
- 1 milhão de tokens/dia

### Opção 2: OpenAI (Pago)

```bash
# 1. Obtenha sua chave em:
#    https://platform.openai.com/api-keys

# 2. Adicione no .env.local:
OPENAI_API_KEY=sk-...
```

**Preços:** ~$0.15/1M tokens (GPT-4o-mini)

### Opção 3: Anthropic Claude (Pago)

```bash
# 1. Obtenha sua chave em:
#    https://console.anthropic.com/

# 2. Adicione no .env.local:
ANTHROPIC_API_KEY=sk-ant-...
```

**Preços:** ~$0.80/1M tokens (Claude 3.5 Haiku)

### Sem API? Use o Modo Demo

Se nenhuma API estiver configurada, o sistema funciona em **modo demonstração** com respostas simuladas.

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # API de chat
│   │   └── analyze/route.ts     # API de análise
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Interface do chat
├── components/
│   └── ui/                      # Componentes shadcn/ui
└── lib/
    ├── ai-providers/            # Provedores de IA
    │   ├── index.ts             # Gerenciador
    │   ├── gemini.ts            # Google Gemini
    │   ├── openai.ts            # OpenAI
    │   ├── anthropic.ts         # Anthropic
    │   └── demo.ts              # Modo demo
    └── utils.ts                 # Utilitários
```

---

## 🤖 Modelos Suportados

| Modelo | Tier | Tokens | Melhor Para |
|--------|------|--------|-------------|
| Gemini 3 Flash | Econômico | ~2K | Bugs simples, boilerplate |
| Gemini 3.1 Pro Low | Econômico | ~5K | Refatorações médias |
| Gemini 3.1 Pro High | Médio | ~10K | Arquitetura, integrações |
| GPT-OSS 120b | Médio | ~12K | Código legado, docs |
| Claude Sonnet 4.6 | Premium | ~20K | Debug complexo, ML |
| Claude Opus 4.6 | Premium | ~40K | Decisões críticas |

---

## 🔌 Trocando o Provedor de IA

### Usando o arquivo existente

Os provedores já estão prontos em `src/lib/ai-providers/`. Para ativar um:

1. Instale o SDK do provedor desejado:

```bash
# Para Gemini (gratuito)
bun add @google/generative-ai

# Para OpenAI
bun add openai

# Para Anthropic
bun add @anthropic-ai/sdk
```

2. Configure a variável de ambiente no `.env.local`

3. Reinicie o servidor

### Prioridade de Provedores

O sistema escolhe automaticamente na ordem:
1. Gemini (se `GEMINI_API_KEY` existir)
2. OpenAI (se `OPENAI_API_KEY` existir)
3. Anthropic (se `ANTHROPIC_API_KEY` existir)
4. Demo (se nenhum configurado)

### Criando seu próprio provedor

Crie um arquivo em `src/lib/ai-providers/seu-provedor.ts`:

```typescript
export async function callSeuProvedor(
  message: string, 
  history: Array<{role: string, content: string}>,
  code?: string,
  codeLanguage?: string
): Promise<string> {
  // Sua implementação aqui
  return "Resposta da IA";
}

export const SeuProvedorProvider = {
  name: 'Nome do Provedor',
  id: 'seu-provedor',
  call: callSeuProvedor
};
```

Depois adicione no `index.ts`.

---

## 📋 Scripts Disponíveis

```bash
bun run dev      # Desenvolvimento (localhost:3000)
bun run build    # Build para produção
bun run start    # Rodar build de produção
bun run lint     # Verificar código
```

---

## 🔒 Segurança

**NUNCA** commite arquivos `.env` ou chaves de API. Elas já estão no `.gitignore`.

---

## 📝 Licença

MIT License - Use livremente em seus projetos.

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📧 Contato

Dúvidas ou sugestões? Abra uma [Issue](https://github.com/igortude/architect-ai/issues).

---

Feito com ❤️ usando Next.js, TypeScript e Tailwind CSS
