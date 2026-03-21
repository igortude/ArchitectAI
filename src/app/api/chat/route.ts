/**
 * ArchitectAI - API de Chat
 * Analisa código, identifica problemas e recomenda modelos de IA
 */

import { NextRequest, NextResponse } from 'next/server';
import { callAI, listProviders } from '@/lib/ai-providers';

// Modelos disponíveis para recomendação
const AVAILABLE_MODELS = [
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', tier: 'economico', tokens: 'low', bestFor: ['bug-simples', 'boilerplate', 'fix-pequeno'], color: 'bg-emerald-500' },
  { id: 'gemini-3.1-pro-low', name: 'Gemini 3.1 Pro Low', tier: 'economico', tokens: 'low', bestFor: ['refatoracao-media', 'integracao-api'], color: 'bg-emerald-600' },
  { id: 'gemini-3.1-pro-high', name: 'Gemini 3.1 Pro High', tier: 'medio', tokens: 'medium', bestFor: ['arquitetura', 'integracao-complexa'], color: 'bg-amber-500' },
  { id: 'gpt-oss-120b', name: 'GPT-OSS 120b', tier: 'medio', tokens: 'medium', bestFor: ['codigo-legado', 'documentacao'], color: 'bg-amber-600' },
  { id: 'claude-sonnet-4.6-thinking', name: 'Claude Sonnet 4.6 Thinking', tier: 'premium', tokens: 'high', bestFor: ['debug-complexo', 'arquitetura-complexa', 'ml-features'], color: 'bg-purple-500' },
  { id: 'claude-opus-4.6-thinking', name: 'Claude Opus 4.6 Thinking', tier: 'premium', tokens: 'high', bestFor: ['refatoracao-grande', 'design-sistema', 'decisoes-criticas'], color: 'bg-purple-700' },
];

// Armazenamento em memória para conversas (simples para demo)
const conversations = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, code, codeLanguage } = body;

    // Gerar ID se não existir
    const convId = conversationId || `conv_${Date.now()}`;
    
    // Recuperar histórico
    if (!conversations.has(convId)) {
      conversations.set(convId, []);
    }
    const history = conversations.get(convId) || [];

    // Chamar IA
    const { response: assistantMessage, provider } = await callAI(
      message, 
      history.map((m: any) => ({ role: m.role, content: m.content })),
      code,
      codeLanguage
    );

    // Detectar modelo recomendado na resposta
    let recommendedModel = null;
    const modelPatterns = [
      { pattern: /gemini 3 flash/i, model: AVAILABLE_MODELS[0] },
      { pattern: /gemini 3\.1 pro low/i, model: AVAILABLE_MODELS[1] },
      { pattern: /gemini 3\.1 pro high/i, model: AVAILABLE_MODELS[2] },
      { pattern: /gpt-oss 120b/i, model: AVAILABLE_MODELS[3] },
      { pattern: /claude sonnet 4\.6/i, model: AVAILABLE_MODELS[4] },
      { pattern: /claude opus 4\.6/i, model: AVAILABLE_MODELS[5] },
    ];
    
    for (const { pattern, model } of modelPatterns) {
      if (pattern.test(assistantMessage)) {
        recommendedModel = model;
        break;
      }
    }

    // Estimar tokens
    const tokenEstimate = Math.ceil((message.length + assistantMessage.length) / 4);

    // Salvar no histórico
    history.push({ role: 'user', content: message, timestamp: Date.now() });
    history.push({ role: 'assistant', content: assistantMessage, timestamp: Date.now() });
    conversations.set(convId, history);

    return NextResponse.json({
      success: true,
      conversationId: convId,
      message: assistantMessage,
      modelRecommendation: recommendedModel,
      tokenEstimate,
      provider,
    });

  } catch (error: any) {
    console.error('[ArchitectAI] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    // Obter conversa específica
    if (conversationId && conversations.has(conversationId)) {
      return NextResponse.json({ 
        success: true, 
        conversation: {
          id: conversationId,
          messages: conversations.get(conversationId)
        }
      });
    }

    // Listar modelos e provedores disponíveis
    return NextResponse.json({ 
      success: true, 
      models: AVAILABLE_MODELS,
      providers: listProviders(),
      conversationsCount: conversations.size
    });

  } catch (error: any) {
    console.error('[ArchitectAI] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
