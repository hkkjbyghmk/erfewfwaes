import { NextRequest, NextResponse } from 'next/server';
import { createLLM, createExchangeChain, ExchangeContext } from '@/lib/langchain/config';
import { getExchangeContext } from '@/lib/api/exchange-rates';

// Aumenta o timeout para permitir resposta do LLM
export const maxDuration = 30;

/**
 * Endpoint POST para o chatbot de câmbio
 *
 * Body esperado:
 * {
 *   message: string,
 *   context?: Partial<ExchangeContext>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context: customContext } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Verifica se a chave API está configurada
    if (!process.env.OPENAI_API_KEY) {
      // Retorna resposta simulada se não houver API key
      return NextResponse.json({
        response: generateFallbackResponse(message),
        isFallback: true,
        message: 'Modo demonstração (configure OPENAI_API_KEY para respostas IA)',
      });
    }

    // Obtém contexto de câmbio atual
    const exchangeContext: ExchangeContext = customContext
      ? { ...await getExchangeContext(), ...customContext }
      : await getExchangeContext();

    // Cria e executa a cadeia LangChain
    const llm = createLLM();
    const chain = createExchangeChain(llm);

    const response = await chain.invoke({
      question: message,
      context: exchangeContext,
    });

    return NextResponse.json({
      response,
      context: exchangeContext,
      isFallback: false,
    });
  } catch (error) {
    console.error('Erro no chatbot:', error);

    // Fallback em caso de erro
    return NextResponse.json({
      response: generateFallbackResponse(
        error instanceof Error ? error.message : 'Erro desconhecido'
      ),
      isFallback: true,
      error: error instanceof Error ? error.message : 'Erro ao processar mensagem',
    });
  }
}

/**
 * Endpoint GET para health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    hasApiKey: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Resposta fallback quando não há API key configurada
 */
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('eur') || lowerMessage.includes('euro')) {
    return '1 EUR ≈ 909 AOA (taxa de venda com spread de 27%). Para conversão exata, use o conversor principal.';
  }

  if (lowerMessage.includes('usd') || lowerMessage.includes('dólar') || lowerMessage.includes('dolar')) {
    return '1 USD ≈ 833 AOA (taxa de venda com spread de 27%). Para conversão exata, use o conversor principal.';
  }

  if (lowerMessage.includes('brl') || lowerMessage.includes('real') || lowerMessage.includes('reais')) {
    return '1 BRL ≈ 166 AOA (taxa de venda com spread de 27%). Para conversão exata, use o conversor principal.';
  }

  if (lowerMessage.includes('spread') || lowerMessage.includes('taxa')) {
    return 'Spread atual: Venda +27%, Compra -12%. Isso significa que na venda adicionamos 27% à taxa base, e na compra subtraímos 12%.';
  }

  if (lowerMessage.includes('ajuda') || lowerMessage.includes('help') || lowerMessage.includes('como')) {
    return 'Posso ajudar com: conversões de moedas (EUR, USD, BRL para AOA), informações sobre spreads, e dicas de câmbio. Digite sua pergunta!';
  }

  return 'Olá! Sou o assistente de câmbio. Posso ajudar com conversões entre EUR, USD, BRL e AOA. Configure OPENAI_API_KEY para respostas mais completas.';
}
