"use client"

import { useState, useEffect, useCallback } from "react"
import { CurrencyCard } from "@/components/ui/currency-card"
import { CurrencyInput } from "@/components/ui/currency-input"
import { RateDisplay } from "@/components/ui/rate-display"
import { AdminPanel } from "@/components/admin-panel"
import { AIAssistant } from "@/components/ai-assistant"
import { useExchangeRates, formatCountdown } from "@/hooks/use-exchange-rates"
import { useCurrencyConverter } from "@/hooks/use-currency-converter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { CurrencyCode } from "@/types/currency"

export default function Home() {
  const { rates, isLoading, error, lastUpdated, countdown } = useExchangeRates()

  // Estado para margens
  const [margins, setMargins] = useState({ sale: 27, buy: -12 })
  const [isAdminVisible, setIsAdminVisible] = useState(false)

  // Calcular taxas com margem
  const saleRates = {
    EUR: rates.EUR * (1 + margins.sale / 100),
    USD: rates.USD * (1 + margins.sale / 100),
    BRL: rates.BRL * (1 + margins.sale / 100),
  }

  const buyRates = {
    EUR: rates.EUR * (1 + margins.buy / 100),
    USD: rates.USD * (1 + margins.buy / 100),
    BRL: rates.BRL * (1 + margins.buy / 100),
  }

  // Hook de conversão
  const {
    saleInputs,
    buyInputs,
    results,
    updateSaleInput,
    updateBuyInput,
  } = useCurrencyConverter({ saleRates, buyRates })

  // Lidar com aplicação de porcentagem
  const handleApplyPercentage = useCallback((type: "sale" | "buy", percentage: number) => {
    setMargins((prev) => ({ ...prev, [type]: percentage }))
  }, [])

  // Formatar hora atual
  const currentTime = new Date().toLocaleTimeString("pt-PT")
  const currentDate = new Date().toLocaleDateString("pt-PT")

  // Copiar IBAN
  const copyIban = () => {
    navigator.clipboard.writeText("AO06 0040 0000 8477 7328 1017 0")
    alert("IBAN copiado!")
  }

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gray-900/80 border-purple-700">
          <CardContent className="p-4">
            <div className="relative">
              {/* Logo */}
              <div className="text-center mb-4">
                <img
                  src="https://images2.imgbox.com/1e/08/nLeuXViC_o.png"
                  alt="Euro Shark Logo"
                  className="w-32 mx-auto"
                />
                <h1 className="text-xl text-white mt-2 font-bold">Conversor de Moedas</h1>
              </div>

              {/* Clock */}
              <div className="absolute top-0 right-0 text-right text-white">
                <div className="text-lg font-mono">{currentTime}</div>
                <div className="text-sm text-gray-400">{currentDate}</div>
                <div className="text-xs text-purple-400 mt-1">
                  Atualização em: {formatCountdown(countdown)}
                </div>
              </div>

              {/* Botão Admin */}
              <div className="text-center mt-4">
                <Button
                  onClick={() => setIsAdminVisible(!isAdminVisible)}
                  variant="outline"
                  className="border-purple-600 text-white hover:bg-purple-900/50"
                >
                  🔐 {isAdminVisible ? "Ocultar Admin" : "Administrador"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Painel Admin */}
        {isAdminVisible && (
          <AdminPanel
            onApplyPercentage={handleApplyPercentage}
            currentPercentages={margins}
          />
        )}

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/50 border-red-600">
            <CardContent className="p-4 text-white">
              <p className="font-semibold">Erro: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Tabelas de Taxas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RateDisplay rates={rates} isLoading={isLoading} lastUpdated={lastUpdated} />
          <CurrencyCard
            title="Taxas de Venda"
            variant="sale"
            rates={saleRates}
          />
          <CurrencyCard
            title="Taxas de Compra"
            variant="buy"
            rates={buyRates}
          />
        </div>

        {/* Conversores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Taxa de Venda */}
          <Card className="bg-gray-900/80 border-2 border-yellow-600">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📈</span> Taxa de Venda
              </h3>
              <CurrencyInput
                label="EUR"
                currency="EUR"
                value={saleInputs.EUR}
                onChange={(v) => updateSaleInput("EUR", v)}
                result={results.sale.EUR}
              />
              <CurrencyInput
                label="USD"
                currency="USD"
                value={saleInputs.USD}
                onChange={(v) => updateSaleInput("USD", v)}
                result={results.sale.USD}
              />
              <CurrencyInput
                label="BRL"
                currency="BRL"
                value={saleInputs.BRL}
                onChange={(v) => updateSaleInput("BRL", v)}
                result={results.sale.BRL}
              />
            </CardContent>
          </Card>

          {/* Taxa de Compra */}
          <Card className="bg-gray-900/80 border-2 border-green-600">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📉</span> Taxa de Compra
              </h3>
              <CurrencyInput
                label="EUR"
                currency="EUR"
                value={buyInputs.EUR}
                onChange={(v) => updateBuyInput("EUR", v)}
                result={results.buy.EUR}
              />
              <CurrencyInput
                label="USD"
                currency="USD"
                value={buyInputs.USD}
                onChange={(v) => updateBuyInput("USD", v)}
                result={results.buy.USD}
              />
              <CurrencyInput
                label="BRL"
                currency="BRL"
                value={buyInputs.BRL}
                onChange={(v) => updateBuyInput("BRL", v)}
                result={results.buy.BRL}
              />
            </CardContent>
          </Card>
        </div>

        {/* IBAN Section */}
        <Card className="bg-gray-900/80 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3 text-white">
              <span className="text-lg">🏦</span>
              <span className="font-semibold">IBAN BAI:</span>
              <code className="bg-gray-800 px-3 py-1 rounded">
                AO06 0040 0000 8477 7328 1017 0
              </code>
              <Button
                onClick={copyIban}
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-purple-900/50"
              >
                <span className="text-xl">📋</span>
              </Button>
            </div>
            <p className="text-center text-gray-400 text-sm mt-2">
              Titular: Leonel Smith Fragoso
            </p>
          </CardContent>
        </Card>

        {/* Assistente IA */}
        <AIAssistant />
      </div>
    </div>
  )
}
