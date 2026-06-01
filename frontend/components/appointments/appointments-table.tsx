"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check, X } from "lucide-react"

export type AppointmentStatus = "pendente" | "confirmado" | "cancelado" | "concluido"

export interface Appointment {
  id: string
  horario: string
  cliente: string
  barbeiro: string
  servico: string
  valor: number
  status: AppointmentStatus
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  pendente: {
    label: "Pendente",
    className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  },
  confirmado: {
    label: "Confirmado",
    className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  },
  concluido: {
    label: "Concluído",
    className: "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20",
  },
}

interface AppointmentsTableProps {
  appointments: Appointment[]
  onStatusChange?: (id: string, status: string) => void
}

export function AppointmentsTable({ appointments, onStatusChange }: AppointmentsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Horário</TableHead>
            <TableHead className="text-muted-foreground">Cliente</TableHead>
            <TableHead className="text-muted-foreground">Barbeiro</TableHead>
            <TableHead className="text-muted-foreground">Serviço</TableHead>
            <TableHead className="text-muted-foreground">Valor</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-right text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                Nenhum agendamento encontrado para este dia.
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id} className="border-border">
                <TableCell className="font-medium text-foreground">
                  {appointment.horario}
                </TableCell>
                <TableCell className="text-foreground">{appointment.cliente}</TableCell>
                <TableCell className="text-foreground">{appointment.barbeiro}</TableCell>
                <TableCell className="text-foreground">{appointment.servico}</TableCell>
                <TableCell className="text-foreground">
                  {formatCurrency(appointment.valor)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusConfig[appointment.status]?.className}
                  >
                    {statusConfig[appointment.status]?.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {appointment.status === "pendente" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                          onClick={() => onStatusChange?.(appointment.id, "confirmado")}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Confirmar</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => onStatusChange?.(appointment.id, "cancelado")}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancelar</span>
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmado" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => onStatusChange?.(appointment.id, "cancelado")}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancelar</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}