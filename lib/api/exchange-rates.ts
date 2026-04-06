import { Currency, ExchangeContext } from '../langchain/config';

// Configurações de spread (percentual)
const DEFAULT_SPREAD = {
  venda: 27,   // 27% para venda
  compra: -12, // -12% para compra
};

// Cache das taxas para evitar muitas requisições
let cachedRates: {
  data: Record<string, number> | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Busca taxas de câmbio da API
 * Base: AOA (Kwanza angolano)
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();

  // Retorna do cache se ainda válido
  if (cachedRates.data && now - cachedRates.timestamp < CACHE_TTL) {
    return cachedRates.data;
  }

  try {
    // API pública sem necessidade de chave
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/AOA');

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates) {
      throw new Error('Dados de taxas não encontrados');
    }

    cachedRates = {
      data: data.rates,
      timestamp: now,
    };

    return data.rates;
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error);

    // Fallback para taxas em cache (mesmo que expiradas)
    if (cachedRates.data) {
      return cachedRates.data;
    }

    // Taxas de fallback hardcoded
    return {
      USD: 0.0012,
      EUR: 0.0011,
      BRL: 0.006,
      AOA: 1,
    };
  }
}

/**
 * Converte um valor entre moedas
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Record<string, number>,
  type: 'venda' | 'compra' = 'venda'
): number {
  if (from === to) return amount;

  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;

  // Converte para AOA primeiro, depois para moeda destino
  const amountInAOA = from === 'AOA' ? amount : amount / fromRate;
  const resultInAOA = to === 'AOA' ? amountInAOA : amountInAOA * toRate;

  // Aplica o spread
  const spread = type === 'venda' ? DEFAULT_SPREAD.venda : DEFAULT_SPREAD.compra;
  const spreadMultiplier = 1 + (spread / 100);

  return resultInAOA * spreadMultiplier;
}

/**
 * Obtém o contexto completo de câmbio para o LangChain
 */
export async function getExchangeContext(): Promise<ExchangeContext> {
  const rates = await fetchExchangeRates();

  // Filtra apenas moedas suportadas
  const filteredRates: Record<string, number> = {};
  const supportedCurrencies = ['USD', 'EUR', 'BRL'];

  supportedCurrencies.forEach(currency => {
    if (rates[currency]) {
      // Inverte a taxa para mostrar quanto 1 unidade da moeda vale em AOA
      filteredRates[currency] = 1 / rates[currency];
    }
  });

  return {
    baseCurrency: 'AOA',
    rates: filteredRates,
    lastUpdated: new Date().toLocaleString('pt-AO'),
    spread: DEFAULT_SPREAD,
  };
}

/**
 * Calcula recomendação baseada em tendências simples
 * (Análise básica - em produção usaria dados históricos)
 */
export function getConversionRecommendation(
  from: Currency,
  to: Currency,
  amount: number
): { recommendation: string; reason: string } {
  // Lógica simples baseada no spread atual
  const isVenda = from === 'AOA'; // Convertendo de AOA para outra moeda = venda
  const spread = isVenda ? DEFAULT_SPREAD.venda : DEFAULT_SPREAD.compra;

  if (spread > 20) {
    return {
      recommendation: 'considere-esperar',
      reason: `O spread atual de ${spread}% está acima da média. Para valores altos, considere aguardar uma taxa mais favorável.`,
    };
  } else if (spread < 15) {
    return {
      recommendation: 'bom-momento',
      reason: `O spread atual de ${spread}% está razoável. Pode ser um bom momento para converter.`,
    };
  }

  return {
    recommendation: 'neutro',
    reason: `Spread atual de ${spread}%. Taxa dentro da normalidade.`,
  };
}

/**
 * Histórico simulado para análise de tendências
 * Em produção, isso viria de um banco de dados
 */
export interface RateHistory {
  date: string;
  rate: number;
}

export function getRateHistory(currency: Currency): RateHistory[] {
  // Dados simulados para demonstração
  const baseRate = currency === 'USD' ? 833 : currency === 'EUR' ? 909 : 166;
  const variance = baseRate * 0.02; // 2% de variação

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const randomVariance = (Math.random() - 0.5) * variance * 2;

    return {
      date: date.toLocaleDateString('pt-AO'),
      rate: baseRate + randomVariance,
    };
  });
}

/**
 * Analisa tendência dos últimos dias
 */
export function analyzeTrend(currency: Currency): {
  direction: 'alta' | 'baixa' | 'estavel';
  change: number;
  summary: string;
} {
  const history = getRateHistory(currency);

  if (history.length < 2) {
    return {
      direction: 'estavel',
      change: 0,
      summary: 'Dados insuficientes para análise',
    };
  }

  const firstRate = history[0].rate;
  const lastRate = history[history.length - 1].rate;
  const change = ((lastRate - firstRate) / firstRate) * 100;

  let direction: 'alta' | 'baixa' | 'estavel' = 'estavel';
  if (change > 1) direction = 'alta';
  if (change < -1) direction = 'baixa';

  return {
    direction,
    change,
    summary: `${currency}: ${direction === 'alta' ? 'Valorizando' : direction === 'baixa' ? 'Desvalorizando' : 'Estável'} ${Math.abs(change).toFixed(2)}% nos últimos 7 dias`,
  };
}
