"use client"

import { useState, useEffect, useCallback } from "react"

interface ExchangeRates {
  EUR: number
  USD: number
  BRL: number
}

interface UseExchangeRatesReturn {
  rates: ExchangeRates
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  refreshRates: () => Promise<void>
  countdown: number
}

const API_URL = "https://api.exchangerate-api.com/v4/latest/AOA"
const REFRESH_INTERVAL = 1800000 // 30 minutos

export function useExchangeRates(): UseExchangeRatesReturn {
  const [rates, setRates] = useState<ExchangeRates>({ EUR: 0, USD: 0, BRL: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(1800) // 30 minutos em segundos

  const fetchRates = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(API_URL)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao obter taxas de câmbio")
      }

      const { EUR, USD, BRL } = data.rates

      // Converter para taxa AOA por unidade de moeda estrangeira
      setRates({
        EUR: 1 / EUR,
        USD: 1 / USD,
        BRL: 1 / BRL,
      })

      setLastUpdated(new Date())
      setCountdown(1800) // Reset countdown
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      console.error("Erro ao obter taxas de câmbio:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()

    // Auto-refresh a cada 30 minutos
    const interval = setInterval(fetchRates, REFRESH_INTERVAL)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 1800))
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [fetchRates])

  return {
    rates,
    isLoading,
    error,
    lastUpdated,
    refreshRates: fetchRates,
    countdown,
  }
}

export function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
}
