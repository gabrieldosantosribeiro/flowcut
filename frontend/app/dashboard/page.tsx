import { Sidebar } from "@/components/dashboard/sidebar"
import { MetricCard } from "@/components/dashboard/metric-card"
import { AppointmentsTable } from "@/components/dashboard/appointments-table"
import { PopularServicesChart } from "@/components/dashboard/popular-services-chart"
import { Calendar, DollarSign, Users, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeItem="dashboard" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Bom dia, João 👋
            </h1>
            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {today}
            </p>
          </div>

          {/* Metric Cards */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Agendamentos hoje"
              value="12"
              icon={Calendar}
              trend={{ value: "8%", isPositive: true }}
            />
            <MetricCard
              title="Faturamento do mês"
              value="R$ 3.240"
              icon={DollarSign}
              trend={{ value: "12%", isPositive: true }}
            />
            <MetricCard
              title="Clientes ativos"
              value="89"
              icon={Users}
              trend={{ value: "5%", isPositive: true }}
            />
            <MetricCard
              title="Taxa de conclusão"
              value="94%"
              icon={CheckCircle}
              trend={{ value: "2%", isPositive: true }}
            />
          </div>

          {/* Tables and Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <AppointmentsTable />
            <PopularServicesChart />
          </div>
        </div>
      </main>
    </div>
  )
}
