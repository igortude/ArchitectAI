🏗️ ArchitectAI








Chatbot inteligente para análise de código e otimização de uso de LLMs.
Entenda seu código, reduza custos com tokens e escolha o modelo certo.

🚀 Links
🔗 Demo: (adicione aqui)
📚 Documentação: (adicione aqui)
🐙 Repositório: https://github.com/igortude/antigravity-token_analyst
🎯 O Problema

Desenvolvedores frequentemente gastam tokens desnecessários ao usar modelos de IA para análise de código, sem clareza sobre:

Qual modelo é mais eficiente
Quanto custo/token estão consumindo
Quando usar modelos mais baratos vs mais robustos

Resultado: dinheiro desperdiçado + decisões ruins.

✨ A Solução

O ArchitectAI atua como um arquiteto de software com IA, analisando seu código e recomendando a melhor estratégia.

Funcionalidades
💬 Chat inteligente com contexto de código
📁 Upload de arquivos individuais
📦 Análise completa de projetos (ZIP)
🤖 Recomendação automática de modelos
📊 Estimativa de tokens
🌙 Dark mode
📱 Responsivo
📊 Resultados
Métrica	Impacto
💰 Economia de tokens	~40–50%
⚡ Tempo de análise	~2s por arquivo
🎯 Eficiência de escolha	Alta
🚀 Quick Start
1. Clone o projeto
git clone https://github.com/igortude/antigravity-token_analyst.git
cd antigravity-token_analyst
2. Instale as dependências
bun install
3. Configure o ambiente
cp .env.example .env.local
4. Rode o projeto
bun run dev

Acesse: http://localhost:3000

🔧 Configuração de APIs
✅ Google Gemini (Recomendado - Gratuito)
GEMINI_API_KEY=sua_chave_aqui

Limites:

15 req/min
1.500 req/dia
~1M tokens/dia
💰 OpenAI
OPENAI_API_KEY=sk-...
💰 Anthropic
ANTHROPIC_API_KEY=sk-ant-...
🧪 Modo Demo

Sem API configurada, o sistema roda com respostas simuladas.

🤖 Modelos Suportados
Modelo	Tier	Uso Ideal
Gemini Flash	Econômico	Bugs simples
Gemini Pro	Econômico	Refatorações
GPT-4o-mini	Médio	Código geral
Claude Sonnet	Premium	Debug complexo
Claude Opus	Premium	Arquitetura crítica
🧠 Como Funciona
Você envia código ou projeto
O sistema analisa contexto
Estima custo em tokens
Recomenda o modelo ideal
Retorna análise otimizada
📁 Estrutura do Projeto
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── analyze/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
└── lib/
    ├── ai-providers/
    └── utils.ts
🔌 Arquitetura de Provedores

Prioridade automática:

Gemini
OpenAI
Anthropic
Demo
Criando um novo provedor
export async function callSeuProvedor(...) {
  return "Resposta";
}

Depois registre no index.ts.

📜 Scripts
bun run dev
bun run build
bun run start
bun run lint
🔒 Segurança
Nunca commite .env
Nunca exponha chaves de API
Use variáveis de ambiente
🤝 Contribuindo
Fork do projeto
Crie uma branch (feature/minha-feature)
Commit (git commit -m 'feat: nova feature')
Push
Abra um PR
📄 Licença

MIT License

💡 Contexto

Projeto criado para ajudar desenvolvedores — especialmente no ecossistema Antigravity — a economizar tokens e tomar decisões melhores ao usar IA.

📬 Contato

Abra uma issue para dúvidas ou sugestões.
