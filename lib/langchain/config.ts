import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Tipos para o contexto de câmbio
export interface ExchangeContext {
  baseCurrency: string;
  rates: Record<string, number>;
  lastUpdated: string;
  spread: {
    venda: number;
    compra: number;
  };
}

// Configuração do modelo LLM
export const createLLM = () => {
  return new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.3,
    maxTokens: 500,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};

// Prompt template para o assistente de câmbio
export const exchangeAssistantPrompt = PromptTemplate.fromTemplate(`
Você é um assistente especializado em câmbio de moedas, ajudando usuários com conversões monetárias.

CONTEXTO ATUAL:
- Moeda base: {baseCurrency}
- Taxas disponíveis: {availableRates}
- Spread de venda: {spreadVenda}%
- Spread de compra: {spreadCompra}%
- Última atualização: {lastUpdated}

INSTRUÇÕES:
1. Ajude o usuário a converter valores entre moedas
2. Explique de forma clara como funcionam os spreads
3. Se perguntado sobre tendências, seja honesto sobre limitações de dados
4. Use formato monetário adequado (ex: 1.234,56 AOA)
5. Seja prestativo mas conciso

PERGUNTA DO USUÁRIO: {question}

RESPOSTA:
`);

// Output parser simples
const outputParser = new StringOutputParser();

// Cadeia principal do assistente
export const createExchangeChain = (llm: ReturnType<typeof createLLM>) => {
  return RunnableSequence.from([
    {
      question: (input: { question: string; context: ExchangeContext }) => input.question,
      baseCurrency: (input: { question: string; context: ExchangeContext }) => input.context.baseCurrency,
      availableRates: (input: { question: string; context: ExchangeContext }) =>
        Object.entries(input.context.rates)
          .map(([currency, rate]) => `${currency}: ${rate.toFixed(4)}`)
          .join(" | "),
      spreadVenda: (input: { question: string; context: ExchangeContext }) => input.context.spread.venda,
      spreadCompra: (input: { question: string; context: ExchangeContext }) => input.context.spread.compra,
      lastUpdated: (input: { question: string; context: ExchangeContext }) => input.context.lastUpdated,
    },
    exchangeAssistantPrompt,
    llm,
    outputParser,
  ]);
};

// Função utilitária para formatar valores monetários
export const formatCurrency = (value: number, currency: string): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Tipos de moedas suportadas
export const SUPPORTED_CURRENCIES = ['AOA', 'USD', 'EUR', 'BRL'] as const;
export type Currency = typeof SUPPORTED_CURRENCIES[number];
