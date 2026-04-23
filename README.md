# 🏗️ ArchitectAI

> **O Arquiteto de Software Senior na sua máquina.**  
> Chatbot inteligente para análise de código e otimização radical do uso de LLMs.  
> Entenda seu código, reduza custos com tokens e escolha o modelo certo para cada tarefa.

---

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Bun](https://img.shields.io/badge/Bun-v1.3+-fbf0df?style=for-the-badge&logo=bun&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 🚀 Links
- 🔗 **Repositório:** [https://github.com/igortude/ArchitectAI](https://github.com/igortude/ArchitectAI)
- 🧪 **Demo Online:** [![Live Demo](https://img.shields.io/badge/Demo-Live-00b4d8?style=for-the-badge&logo=vercel&logoColor=white)](https://architect-ai-plum-seven.vercel.app/)

<p align="center">
  <a href="https://architect-ai-plum-seven.vercel.app" target="_blank">
    <img src="https://github.com/igortude/ArchitectAI/blob/main/assets/architect.gif?raw=true" alt="ArchtectAI Demonstração" width="80%">
  </a>
</p>

---

## 🎯 O Problema
Desenvolvedores frequentemente gastam tokens desnecessários ao usar modelos de IA para análise de código, sem clareza sobre:
- **Qual modelo é mais eficiente** para o tipo de bug ou refatoração.
- **Quanto custo/token** estão consumindo em cada interação.
- **Quando usar modelos "baratos" (Flash/Haiku)** vs modelos "Premium" (Pro/Opus).

Com isso, resolvi desenvolver um Arquiteto Senior, que verifica o projeto, buscando por falhas, erros no código... E que através de um chatbot, consegue sugerir um melhor modelo para resolver o problema apresentado ou que o usuário esteja precisando. Lembrando que é baseado no Google Antigravity (vibe coding). 
**Resultado:** Dinheiro desperdiçado e decisões de engenharia baseadas em tentativa e erro.

## ✨ A Solução
O **ArchitectAI** atua como um arquiteto de software assistido por IA. Ele não apenas analisa seu código, mas recomenda a melhor estratégia de execução, priorizando a economia sem sacrificar a qualidade técnica. Auxiliando, principalemente, iniciantes no vibe coding com a ferramenta.

### 📊 Resultados Médios
| Métrica | Impacto |
| :--- | :--- |
| 💰 **Economia de Tokens** | **~40–50%** |
| ⚡ **Tempo de Análise** | **~2s por arquivo** |
| 🎯 **Eficiência de Escolha** | **Alta (Model-Aware)** |

---

## 🚀 Principais Funcionalidades
- 💬 **Chat Contextual:** Interface de conversa fluida com contexto total dos seus arquivos de código.
- 📁 **Análise de Arquivos:** Upload de arquivos individuais para revisões rápidas.
- 📦 **Projetos Completos:** Suporte para upload de arquivos .ZIP para análise de arquitetura.
- 🤖 **Curadoria de Modelos:** Recomendação automática do modelo ideal baseado no contexto.
- 📊 **Token Estimator:** Estimativa em tempo real de consumo de tokens.
- 🌙 **Modern Design:** Interface Dark Mode responsiva com animações suaves (Framer Motion).

---

## ⚙️ Início Rápido

### 1. Clonar e Instalar
```bash
# Clone o projeto
git clone https://github.com/igortude/ArchitectAI.git
cd ArchitectAI

# Instale as dependências com Bun
bun install
```

### 2. Configurar Ambiente
```bash
cp .env.example .env.local
```

### 3. Rodar o Projeto
```bash
bun run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🔧 Configuração de APIs
O ArchitectAI suporta múltiplos provedores. Configure pelo menos um no seu `.env.local`:

### ✅ Google Gemini (Recomendado - Tier Gratuito)
```bash
# Obtenha em: https://aistudio.google.com/apikey
GEMINI_API_KEY=sua_chave_aqui
```
*Limites: 15 req/min | 1M tokens/dia.*

### 💰 OpenAI & Anthropic
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

> [!NOTE]
> **Modo Demo:** Se nenhuma chave for configurada, o sistema iniciará automaticamente em **modo de demonstração** com respostas simuladas para testes de interface.

---

## 🤖 Modelos Suportados

| Modelo | Tier | Uso Recomendado |
| :--- | :--- | :--- |
| **Gemini 1.5 Flash** | Econômico | Bugs simples, CSS, Documentação |
| **Gemini 1.5 Pro** | Equilibrado | Refatorações e Lógica de Negócio |
| **GPT-4o-mini** | Médio | Código geral e Revisão de PRs |
| **Claude 3.5 Sonnet** | Premium | Debug complexo e Otimização |
| **Claude 3 Opus** | Crítico | Mudanças na Arquitetura e Segurança |

---

## 📁 Estrutura do Projeto
```text
src/
├── app/          # Rotas e Endpoints da API (Next.js)
├── components/   # Componentes de UI (Radix UI + Shadcn)
├── lib/          # AI Providers e Lógica de Negócios
└── hooks/        # Hooks customizados para gerenciamento de Chat
```

---

## 🔒 Segurança
- **Segurança de API:** Suas chaves nunca são expostas no client-side ou salvas em banco de dados.
- **Variáveis de Ambiente:** Utilize sempre o arquivo `.env.local` que já está ignorado pelo Git.

---

## 🤝 Contribuindo
1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua feature (`git checkout -b feature/AmazingFeature`).
3. Faça o **Commit** das mudanças (`git commit -m 'Add: AmazingFeature'`).
4. Faça o **Push** para a Branch (`git push origin feature/AmazingFeature`).
5. Abra um **Pull Request**.

---

## 📄 Licença
Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

**💡 Contexto:** Este projeto foi criado para ajudar desenvolvedores — especialmente no ecossistema Antigravity — a economizar tokens e tomar decisões melhores ao usar IA.

**📬 Contato:** Dúvidas ou sugestões? [Abra uma Issue](https://github.com/igortude/ArchitectAI/issues).
