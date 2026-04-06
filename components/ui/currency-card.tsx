"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatExchangeRate } from "@/lib/utils"
import { CurrencyCode } from "@/types/currency"

interface CurrencyCardProps {
  title: string
  variant: "sale" | "buy"
  rates: {
    EUR: number
    USD: number
    BRL: number
  }
  onRateClick?: (currency: CurrencyCode, rate: number) => void
}

const currencyFlags: Record<CurrencyCode, string> = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  BRL: "🇧🇷",
  AOA: "🇦🇴",
}

export function CurrencyCard({ title, variant, rates, onRateClick }: CurrencyCardProps) {
  const isSale = variant === "sale"

  return (
    <Card className={`border-2 ${isSale ? 'border-purple-700' : 'border-green-700'} bg-gray-900/80`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <span className="text-lg font-bold">{title}</span>
          <Badge variant={isSale ? "warning" : "success"}>
            {isSale ? "Venda" : "Compra"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 bg-purple-900/30">
              <TableHead className="text-center text-white font-bold">EUR</TableHead>
              <TableHead className="text-center text-white font-bold">USD</TableHead>
              <TableHead className="text-center text-white font-bold">BRL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-gray-700 hover:bg-purple-900/20">
              <TableCell className="text-center text-white font-medium cursor-pointer hover:text-purple-400 transition-colors" onClick={() => onRateClick?.("EUR", rates.EUR)}>
                <span className="mr-1">{currencyFlags.EUR}</span>
                {formatExchangeRate(rates.EUR)}
              </TableCell>
              <TableCell className="text-center text-white font-medium cursor-pointer hover:text-purple-400 transition-colors" onClick={() => onRateClick?.("USD", rates.USD)}>
                <span className="mr-1">{currencyFlags.USD}</span>
                {formatExchangeRate(rates.USD)}
              </TableCell>
              <TableCell className="text-center text-white font-medium cursor-pointer hover:text-purple-400 transition-colors" onClick={() => onRateClick?.("BRL", rates.BRL)}>
                <span className="mr-1">{currencyFlags.BRL}</span>
                {formatExchangeRate(rates.BRL)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
