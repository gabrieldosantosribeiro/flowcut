"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, Scissors, User } from "lucide-react"

interface CustomerData {
  name: string
  phone: string
  email: string
}

interface BookingSummary {
  barberName: string
  serviceName: string
  servicePrice: number
  date: string
  time: string
}

interface CustomerFormProps {
  customerData: CustomerData
  onChange: (data: CustomerData) => void
  onSubmit: () => void
  summary: BookingSummary
  isSubmitting: boolean
}

function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

export function CustomerForm({
  customerData,
  onChange,
  onSubmit,
  summary,
  isSubmitting,
}: CustomerFormProps) {
  const [errors, setErrors] = useState<Partial<CustomerData>>({})

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    onChange({ ...customerData, phone: formatted })
  }

  const validate = () => {
    const newErrors: Partial<CustomerData> = {}
    if (!customerData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }
    if (!customerData.phone.trim() || customerData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone inválido"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Seus dados</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            placeholder="Digite seu nome"
            value={customerData.name}
            onChange={(e) => onChange({ ...customerData, name: e.target.value })}
            className="bg-card border-border"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(11) 99999-9999"
            value={customerData.phone}
            onChange={handlePhoneChange}
            className="bg-card border-border"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            E-mail <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={customerData.email}
            onChange={(e) => onChange({ ...customerData, email: e.target.value })}
            className="bg-card border-border"
          />
        </div>

        {/* Booking Summary */}
        <Card className="p-4 bg-card border-border mt-6">
          <h3 className="font-semibold text-foreground mb-4">Resumo do agendamento</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Barbeiro:</span>
              <span className="text-foreground">{summary.barberName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Scissors className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Serviço:</span>
              <span className="text-foreground">{summary.serviceName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Data:</span>
              <span className="text-foreground">{summary.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Horário:</span>
              <span className="text-foreground">{summary.time}</span>
            </div>
            <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
              <span className="font-medium text-foreground">Total:</span>
              <span className="font-bold text-primary text-lg">
                R$ {summary.servicePrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          className="w-full h-12 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Confirmando..." : "Confirmar agendamento"}
        </Button>
      </form>
    </div>
  )
}
