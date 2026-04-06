"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface AdminPanelProps {
  onApplyPercentage: (type: "sale" | "buy", percentage: number) => void
  currentPercentages: {
    sale: number
    buy: number
  }
}

const ADMIN_PASSWORD = "7851"

export function AdminPanel({ onApplyPercentage, currentPercentages }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [salePercentage, setSalePercentage] = useState(currentPercentages.sale.toString())
  const [buyPercentage, setBuyPercentage] = useState(currentPercentages.buy.toString())
  const [error, setError] = useState("")
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")

      // Auto-logout após 10 segundos
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
      const timeout = setTimeout(() => {
        setIsAuthenticated(false)
        setPassword("")
      }, 10000)
      setHideTimeout(timeout)
    } else {
      setError("Código incorreto!")
    }
  }

  const handleLogout = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
    setIsAuthenticated(false)
    setPassword("")
  }

  const handleApplySale = () => {
    const percentage = parseFloat(salePercentage)
    if (!isNaN(percentage)) {
      onApplyPercentage("sale", percentage)
    }
  }

  const handleApplyBuy = () => {
    const percentage = parseFloat(buyPercentage)
    if (!isNaN(percentage)) {
      onApplyPercentage("buy", percentage)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: "sale" | "buy") => {
    if (e.key === "Enter") {
      if (type === "sale") {
        handleApplySale()
      } else {
        handleApplyBuy()
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <Card className="bg-gray-900/80 border-purple-700 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>🔐</span>
            Área Administrativa
          </CardTitle>
          <CardDescription className="text-gray-400">
            Digite o código para acessar as configurações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-gray-300">
              Código de Acesso
            </Label>
            <div className="flex gap-2">
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Digite o código"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button onClick={handleLogin} variant="default">
                Entrar
              </Button>
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/80 border-2 border-purple-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <span>⚙️</span>
            Painel Administrativo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="success">Autenticado</Badge>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Configure as margens de porcentagem para Venda e Compra
          <span className="text-purple-400 ml-2">(auto-logout em 10s)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Configuração de Venda */}
          <div className="space-y-3">
            <Label className="text-white text-base font-semibold flex items-center gap-2">
              <span className="text-yellow-400">📈</span>
              Margem de Venda (%)
            </Label>
            <div className="flex gap-2">
              <Input
                id="percentage-sale"
                type="number"
                value={salePercentage}
                onChange={(e) => setSalePercentage(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "sale")}
                placeholder="27"
                step="0.01"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button onClick={handleApplySale} className="bg-yellow-600 hover:bg-yellow-700">
                Aplicar
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Valor atual: <span className="text-yellow-400">{currentPercentages.sale}%</span>
            </p>
          </div>

          {/* Configuração de Compra */}
          <div className="space-y-3">
            <Label className="text-white text-base font-semibold flex items-center gap-2">
              <span className="text-green-400">📉</span>
              Margem de Compra (%)
            </Label>
            <div className="flex gap-2">
              <Input
                id="percentage-buy"
                type="number"
                value={buyPercentage}
                onChange={(e) => setBuyPercentage(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "buy")}
                placeholder="-12"
                step="0.01"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button onClick={handleApplyBuy} className="bg-green-600 hover:bg-green-700">
                Aplicar
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Valor atual: <span className="text-green-400">{currentPercentages.buy}%</span>
            </p>
          </div>
        </div>

        {/* Tabela de Resumo */}
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 bg-purple-900/30">
                <TableHead className="text-white">Tipo</TableHead>
                <TableHead className="text-white">Margem</TableHead>
                <TableHead className="text-white">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-700">
                <TableCell className="text-white font-medium">Venda</TableCell>
                <TableCell className="text-yellow-400 font-semibold">{salePercentage}%</TableCell>
                <TableCell>
                  <Badge variant="warning">Ativo</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white font-medium">Compra</TableCell>
                <TableCell className="text-green-400 font-semibold">{buyPercentage}%</TableCell>
                <TableCell>
                  <Badge variant="success">Ativo</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
