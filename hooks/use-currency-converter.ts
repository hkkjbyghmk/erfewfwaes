"use client"

import { useState, useEffect, useCallback } from "react"
import { formatCurrency } from "@/lib/utils"
import { CurrencyCode } from "@/types/currency"

interface UseCurrencyConverterProps {
  saleRates: {
    EUR: number
    USD: number
    BRL: number
  }
  buyRates: {
    EUR: number
    USD: number
    BRL: number
  }
}

type ConverterCurrencyCode = "EUR" | "USD" | "BRL"

interface ConversionResults {
  sale: {
    EUR: string
    USD: string
    BRL: string
  }
  buy: {
    EUR: string
    USD: string
    BRL: string
  }
}

export function useCurrencyConverter({ saleRates, buyRates }: UseCurrencyConverterProps) {
  // Inputs para taxa de venda
  const [saleInputs, setSaleInputs] = useState({
    EUR: "",
    USD: "",
    BRL: "",
  })

  // Inputs para taxa de compra
  const [buyInputs, setBuyInputs] = useState({
    EUR: "",
    USD: "",
    BRL: "",
  })

  // Resultados
  const [results, setResults] = useState<ConversionResults>({
    sale: { EUR: "00.00 AOA", USD: "00.00 AOA", BRL: "00.00 AOA" },
    buy: { EUR: "00.00 AOA", USD: "00.00 AOA", BRL: "00.00 AOA" },
  })

  // Converter valor para venda
  const convertSale = useCallback(
    (currency: ConverterCurrencyCode, value: string) => {
      const rate = saleRates[currency]
      const inputValue = parseFloat(value)

      if (!isNaN(inputValue) && !isNaN(rate) && rate > 0) {
        const result = inputValue * rate
        return formatCurrency(result, "AOA")
      }
      return "00.00 AOA"
    },
    [saleRates]
  )

  // Converter valor para compra
  const convertBuy = useCallback(
    (currency: ConverterCurrencyCode, value: string) => {
      const rate = buyRates[currency]
      const inputValue = parseFloat(value)

      if (!isNaN(inputValue) && !isNaN(rate) && rate > 0) {
        const result = inputValue * rate
        return formatCurrency(result, "AOA")
      }
      return "00.00 AOA"
    },
    [buyRates]
  )

  // Atualizar input de venda
  const updateSaleInput = useCallback(
    (currency: ConverterCurrencyCode, value: string) => {
      setSaleInputs((prev) => ({ ...prev, [currency]: value }))
      setResults((prev) => ({
        ...prev,
        sale: {
          ...prev.sale,
          [currency]: convertSale(currency, value),
        },
      }))
    },
    [convertSale]
  )

  // Atualizar input de compra
  const updateBuyInput = useCallback(
    (currency: ConverterCurrencyCode, value: string) => {
      setBuyInputs((prev) => ({ ...prev, [currency]: value }))
      setResults((prev) => ({
        ...prev,
        buy: {
          ...prev.buy,
          [currency]: convertBuy(currency, value),
        },
      }))
    },
    [convertBuy]
  )

  // Limpar todos os inputs
  const clearAll = useCallback(() => {
    setSaleInputs({ EUR: "", USD: "", BRL: "" })
    setBuyInputs({ EUR: "", USD: "", BRL: "" })
    setResults({
      sale: { EUR: "00.00 AOA", USD: "00.00 AOA", BRL: "00.00 AOA" },
      buy: { EUR: "00.00 AOA", USD: "00.00 AOA", BRL: "00.00 AOA" },
    })
  }, [])

  return {
    saleInputs,
    buyInputs,
    results,
    updateSaleInput,
    updateBuyInput,
    clearAll,
  }
}
