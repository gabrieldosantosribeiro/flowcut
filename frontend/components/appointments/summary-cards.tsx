"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react"

interface SummaryCardsProps {
  totalDia: number
  agendamentos: number
  confirmados: number
  pendentes: number
}

const cards = [
  {
    key: "totalDia" as const,
    title: "Faturamento do dia",
    icon: DollarSign,
    format: (value: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value),
  },
  {
    key: "agendamentos" as const,
    title: "Agendamentos",
    icon: Calendar,
    format: (value: number) => String(value),
  },
  {
    key: "confirmados" as const,
    title: "Confirmados",
    icon: CheckCircle,
    format: (value: number) => String(value),
  },
  {
    key: "pendentes" as const,
    title: "Pendentes",
    icon: Clock,
    format: (value: number) => String(value),
  },
]

export function SummaryCards({
  totalDia,
  agendamentos,
  confirmados,
  pendentes,
}: SummaryCardsProps) {
  const values = { totalDia, agendamentos, confirmados, pendentes }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, title, icon: Icon, format }) => (
        <Card key={key} className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-foreground">
                  {format(values[key])}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
