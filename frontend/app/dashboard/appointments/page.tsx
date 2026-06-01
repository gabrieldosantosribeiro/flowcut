"use client"

import { useCallback, useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SummaryCards } from "@/components/appointments/summary-cards"
import { FiltersBar } from "@/components/appointments/filters-bar"
import {
  AppointmentsTable,
  type Appointment,
} from "@/components/appointments/appointments-table"
import {
  getAppointments,
  getBarberShopIdFromToken,
  updateAppointmentStatus,
} from "@/lib/api"

interface ApiAppointment {
  id: string
  scheduled_at: string
  status: string
  customers: { name: string }
  barbers: { name: string }
  services: { name: string; price: number }
}

const statusMap: Record<string, Appointment["status"]> = {
  pending: "pendente",
  confirmed: "confirmado",
  cancelled: "cancelado",
  completed: "concluido",
}

function mapApiAppointment(a: ApiAppointment): Appointment {
  const date = new Date(a.scheduled_at)
  const horario = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return {
    id: a.id,
    horario,
    cliente: a.customers?.name || "—",
    barbeiro: a.barbers?.name || "—",
    servico: a.services?.name || "—",
    valor: a.services?.price || 0,
    status: statusMap[a.status] || "pendente",
  }
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [barberShopId, setBarberShopId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [barbeiro, setBarbeiro] = useState("todos")
  const [status, setStatus] = useState("todos")

  const loadAppointments = useCallback(async (shopId: string, selectedDate?: Date) => {
    setLoading(true)
    try {
      const dateStr = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : undefined
      const data: ApiAppointment[] = await getAppointments(shopId, dateStr)
      setAppointments(data.map(mapApiAppointment))
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const shopId = getBarberShopIdFromToken()
    if (!shopId) return
    setBarberShopId(shopId)
    loadAppointments(shopId, date)
  }, [loadAppointments])

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (barberShopId) loadAppointments(barberShopId, newDate)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus)
      if (barberShopId) loadAppointments(barberShopId, date)
    } catch {
      console.error("Erro ao atualizar status")
    }
  }

  const filteredAppointments = appointments.filter((a) => {
    if (barbeiro !== "todos" && a.barbeiro !== barbeiro) return false
    if (status !== "todos" && a.status !== status) return false
    return true
  })

  const barbeiros = [...new Set(appointments.map((a) => a.barbeiro))]
  const totalDia = filteredAppointments.reduce((sum, a) => sum + a.valor, 0)
  const confirmados = filteredAppointments.filter((a) => a.status === "confirmado").length
  const pendentes = filteredAppointments.filter((a) => a.status === "pendente").length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
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
              agendamentos={filteredAppointments.length}
              confirmados={confirmados}
              pendentes={pendentes}
            />
            <FiltersBar
              date={date}
              onDateChange={handleDateChange}
              barbeiro={barbeiro}
              onBarbeiroChange={setBarbeiro}
              status={status}
              onStatusChange={setStatus}
              barbeiros={barbeiros}
            />
            {loading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : (
              <AppointmentsTable
                appointments={filteredAppointments}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}