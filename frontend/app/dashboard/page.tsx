"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MetricCard } from "@/components/dashboard/metric-card"
import { AppointmentsTable } from "@/components/dashboard/appointments-table"
import { PopularServicesChart } from "@/components/dashboard/popular-services-chart"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import { Calendar, DollarSign, Users, CheckCircle } from "lucide-react"
import { getAppointments, getBarberShopIdFromToken } from "@/lib/api"

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [metrics, setMetrics] = useState({
    agendamentosHoje: 0,
    faturamentoMes: 0,
    clientesAtivos: 0,
    taxaConclusao: 0,
  })

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })

  useEffect(() => {
    const shopId = getBarberShopIdFromToken()
    if (!shopId) return

    const todayStr = new Date().toISOString().split("T")[0]
    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)

    // Agendamentos de hoje
    getAppointments(shopId, todayStr)
      .then((data: any[]) => {
        setMetrics((prev) => ({ ...prev, agendamentosHoje: data.length }))
      })
      .catch(() => {})

    // Todos os agendamentos para métricas do mês
    getAppointments(shopId)
      .then((data: any[]) => {
        const mesAtual = new Date().getMonth()
        const anoAtual = new Date().getFullYear()

        const doMes = data.filter((a) => {
          const d = new Date(a.scheduled_at)
          return d.getMonth() === mesAtual && d.getFullYear() === anoAtual
        })

        const faturamento = doMes
          .filter((a) => a.status !== "cancelled")
          .reduce((sum: number, a: any) => sum + (a.services?.price || 0), 0)

        const clientes = new Set(data.map((a: any) => a.customers?.id).filter(Boolean)).size

        const concluidos = data.filter((a) => a.status === "completed").length
        const naoCancel = data.filter((a) => a.status !== "cancelled").length
        const taxa = naoCancel > 0 ? Math.round((concluidos / naoCancel) * 100) : 0

        setMetrics((prev) => ({
          ...prev,
          faturamentoMes: faturamento,
          clientesAtivos: clientes,
          taxaConclusao: taxa,
        }))
      })
      .catch(() => {})
  }, [])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Bom dia 👋</h1>
            <p className="mt-1 text-sm capitalize text-muted-foreground">{today}</p>
          </div>

          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Agendamentos hoje"
              value={String(metrics.agendamentosHoje)}
              icon={Calendar}
            />
            <MetricCard
              title="Faturamento do mês"
              value={`R$ ${metrics.faturamentoMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
            />
            <MetricCard
              title="Clientes ativos"
              value={String(metrics.clientesAtivos)}
              icon={Users}
            />
            <MetricCard
              title="Taxa de conclusão"
              value={`${metrics.taxaConclusao}%`}
              icon={CheckCircle}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <AppointmentsTable />
            <PopularServicesChart />
          </div>
        </div>
      </main>
    </div>
  )
}