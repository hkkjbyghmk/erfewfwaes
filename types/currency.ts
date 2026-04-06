export type CurrencyCode = "EUR" | "USD" | "BRL" | "AOA"

export interface ExchangeRate {
  currency: CurrencyCode
  rate: number
  lastUpdated: Date
}

export interface ConversionResult {
  from: CurrencyCode
  to: CurrencyCode
  amount: number
  result: number
  rate: number
}

export interface CurrencyConfig {
  code: CurrencyCode
  name: string
  symbol: string
  flag: string
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "USD", name: "Dólar Americano", symbol: "$", flag: "🇺🇸" },
  { code: "BRL", name: "Real Brasileiro", symbol: "R$", flag: "🇧🇷" },
  { code: "AOA", name: "Kwanza Angolano", symbol: "Kz", flag: "🇦🇴" },
]

export interface RateType {
  type: "sale" | "buy"
  margin: number
}
