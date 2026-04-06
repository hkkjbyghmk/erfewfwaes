"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CurrencyCode } from "@/types/currency"

interface CurrencyInputProps {
  label: string
  currency: CurrencyCode
  value: string
  onChange: (value: string) => void
  result: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

const currencySymbols: Record<CurrencyCode, string> = {
  EUR: "€",
  USD: "$",
  BRL: "R$",
  AOA: "Kz",
}

const currencyFlags: Record<CurrencyCode, string> = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  BRL: "🇧🇷",
  AOA: "🇦🇴",
}

export function CurrencyInput({
  label,
  currency,
  value,
  onChange,
  result,
  placeholder = "Digite aqui",
  className,
  disabled = false,
}: CurrencyInputProps) {
  return (
    <div className={cn("mb-4", className)}>
      <Label htmlFor={`${currency.toLowerCase()}-input`} className="text-white flex items-center gap-2 mb-2">
        <span className="text-lg">{currencyFlags[currency]}</span>
        <span>{label}</span>
        <span className="text-gray-400 text-sm">({currency})</span>
      </Label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {currencySymbols[currency]}
          </span>
          <Input
            id={`${currency.toLowerCase()}-input`}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            step="0.01"
            min="0"
            disabled={disabled}
            className="pl-8 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
            aria-label={`${label} para AOA`}
          />
        </div>
        <span
          className="inline-flex items-center px-4 py-2 bg-purple-900/50 rounded-md text-white font-semibold min-w-[100px] justify-center border border-purple-700"
          aria-live="polite"
        >
          {result}
        </span>
      </div>
    </div>
  )
}
