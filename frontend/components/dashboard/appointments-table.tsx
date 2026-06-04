"use client"

import { useEffect, useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getAppointments, getBarberShopIdFromToken } from "@/lib/api"

interface Appointment {
  id: string
  cliente: string
  barbeiro: string
  servico: string
  horario: string
  status: "confirmado" | "pendente" | "cancelado" | "concluido"
}

const statusConfig = {
  confirmado: { label: "Confirmado", className: "bg-primary/20 text-primary border-primary/30" },
  pendente: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  cancelado: { label: "Cancelado", className: "bg-destructive/20 text-destructive border-destructive/30" },
  concluido: { label: "Concluído", className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
}

const statusMap: Record<string, Appointment["status"]> = {
  pending: "pendente",
  confirmed: "confirmado",
  cancelled: "cancelado",
  completed: "concluido",
}

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const shopId = getBarberShopIdFromToken()
    if (!shopId) return

    const today = new Date().toISOString().split("T")[0]
    getAppointments(shopId, today)
      .then((data: any[]) => {
        const mapped = data.slice(0, 5).map((a) => ({
          id: a.id,
          cliente: a.customers?.name || "—",
          barbeiro: a.barbers?.name || "—",
          servico: a.services?.name || "—",
          horario: new Date(a.scheduled_at).toLocaleTimeString("pt-BR", {
            hour: "2-digit", minute: "2-digit",
            timeZone: "America/Sao_Paulo",
          }),
          status: statusMap[a.status] || "pendente",
        }))
        setAppointments(mapped)
      })
      .catch(() => {})
  }, [])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Próximos agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum agendamento para hoje.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Cliente</TableHead>
                <TableHead className="text-muted-foreground">Barbeiro</TableHead>
                <TableHead className="text-muted-foreground">Serviço</TableHead>
                <TableHead className="text-muted-foreground">Horário</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((a) => (
                <TableRow key={a.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{a.cliente}</TableCell>
                  <TableCell className="text-muted-foreground">{a.barbeiro}</TableCell>
                  <TableCell className="text-muted-foreground">{a.servico}</TableCell>
                  <TableCell className="text-muted-foreground">{a.horario}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", statusConfig[a.status].className)}>
                      {statusConfig[a.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}