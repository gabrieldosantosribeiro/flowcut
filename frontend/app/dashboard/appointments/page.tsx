"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SummaryCards } from "@/components/appointments/summary-cards"
import { FiltersBar } from "@/components/appointments/filters-bar"
import {
  AppointmentsTable,
  type Appointment,
} from "@/components/appointments/appointments-table"

const sampleAppointments: Appointment[] = [
  {
    id: "1",
    horario: "09:00",
    cliente: "João Silva",
    barbeiro: "Carlos",
    servico: "Corte + Barba",
    valor: 75,
    status: "confirmado",
  },
  {
    id: "2",
    horario: "10:00",
    cliente: "Pedro Santos",
    barbeiro: "Rafael",
    servico: "Corte Degradê",
    valor: 55,
    status: "confirmado",
  },
  {
    id: "3",
    horario: "11:00",
    cliente: "Lucas Oliveira",
    barbeiro: "Carlos",
    servico: "Corte + Sobrancelha",
    valor: 60,
    status: "pendente",
  },
  {
    id: "4",
    horario: "14:00",
    cliente: "Matheus Costa",
    barbeiro: "Rafael",
    servico: "Barba",
    valor: 35,
    status: "confirmado",
  },
  {
    id: "5",
    horario: "15:30",
    cliente: "Gabriel Ferreira",
    barbeiro: "Carlos",
    servico: "Corte Social",
    valor: 45,
    status: "pendente",
  },
  {
    id: "6",
    horario: "17:00",
    cliente: "André Rodrigues",
    barbeiro: "Rafael",
    servico: "Corte + Barba + Sobrancelha",
    valor: 115,
    status: "confirmado",
  },
]

const barbeiros = ["Carlos", "Rafael"]

export default function AgendamentosPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [barbeiro, setBarbeiro] = useState("todos")
  const [status, setStatus] = useState("todos")

  const filteredAppointments = sampleAppointments.filter((appointment) => {
    if (barbeiro !== "todos" && appointment.barbeiro !== barbeiro) return false
    if (status !== "todos" && appointment.status !== status) return false
    return true
  })

  const totalDia = filteredAppointments.reduce((sum, a) => sum + a.valor, 0)
  const agendamentosCount = filteredAppointments.length
  const confirmadosCount = filteredAppointments.filter(
    (a) => a.status === "confirmado"
  ).length
  const pendentesCount = filteredAppointments.filter(
    (a) => a.status === "pendente"
  ).length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeItem="agendamentos" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie os agendamentos da sua barbearia
            </p>
          </header>

          <div className="space-y-6">
            <SummaryCards
              totalDia={totalDia}
              agendamentos={agendamentosCount}
              confirmados={confirmadosCount}
              pendentes={pendentesCount}
            />

            <FiltersBar
              date={date}
              onDateChange={setDate}
              barbeiro={barbeiro}
              onBarbeiroChange={setBarbeiro}
              status={status}
              onStatusChange={setStatus}
              barbeiros={barbeiros}
            />

            <AppointmentsTable appointments={filteredAppointments} />
          </div>
        </div>
      </main>
    </div>
  )
}
