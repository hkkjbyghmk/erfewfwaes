"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn, formatExchangeRate } from "@/lib/utils"
import { CurrencyCode } from "@/types/currency"

interface RateDisplayProps {
  rates: {
    EUR: number
    USD: number
    BRL: number
  }
  isLoading?: boolean
  lastUpdated?: Date | null
  className?: string
}

const currencyFlags: Record<CurrencyCode, string> = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  BRL: "🇧🇷",
  AOA: "🇦🇴",
}

export function RateDisplay({ rates, isLoading = false, lastUpdated, className }: RateDisplayProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-900/80 border-gray-700">
        <CardHeader>
          <div className="h-6 w-24 bg-gray-700 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-800 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-gray-900/80 border-2 border-purple-600", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">Taxas de Câmbio</span>
          <Badge variant="outline" className="text-xs">
            Base: AOA
          </Badge>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-400">
            Atualizado em: {lastUpdated.toLocaleTimeString("pt-PT")}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow className="border-gray-700 hover:bg-purple-900/20">
              <TableCell className="text-white font-medium">
                <span className="mr-2">{currencyFlags.EUR}</span>
                1 EUR
              </TableCell>
              <TableCell className="text-right text-purple-400 font-semibold">
                {formatExchangeRate(rates.EUR)}
              </TableCell>
            </TableRow>
            <TableRow className="border-gray-700 hover:bg-purple-900/20">
              <TableCell className="text-white font-medium">
                <span className="mr-2">{currencyFlags.USD}</span>
                1 USD
              </TableCell>
              <TableCell className="text-right text-purple-400 font-semibold">
                {formatExchangeRate(rates.USD)}
              </TableCell>
            </TableRow>
            <TableRow className="border-gray-700 hover:bg-purple-900/20">
              <TableCell className="text-white font-medium">
                <span className="mr-2">{currencyFlags.BRL}</span>
                1 BRL
              </TableCell>
              <TableCell className="text-right text-purple-400 font-semibold">
                {formatExchangeRate(rates.BRL)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
