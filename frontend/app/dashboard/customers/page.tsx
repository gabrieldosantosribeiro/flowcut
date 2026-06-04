"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Eye, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getToken, getBarberShopIdFromToken } from "@/lib/api"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalAgendamentos: number
  ultimoAgendamento: string
}

interface Appointment {
  id: string
  scheduled_at: string
  status: string
  barbers: { name: string }
  services: { name: string; price: number }
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [history, setHistory] = useState<Appointment[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    const shopId = getBarberShopIdFromToken()
    const token = getToken()
    if (!shopId || !token) return

    // Busca clientes e agendamentos juntos
    Promise.all([
      fetch(`${BASE_URL}/customers?barber_shop_id=${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`${BASE_URL}/appointments?barber_shop_id=${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([customersData, appointmentsData]) => {
        const mapped = customersData.map((c: any) => {
          const customerAppointments = appointmentsData.filter(
            (a: any) => a.customers?.id === c.id
          )
          const lastAppointment = customerAppointments
            .sort((a: any, b: any) =>
              new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
            )[0]

          return {
            id: c.id,
            name: c.name || "—",
            phone: c.phone || "—",
            email: c.email || "—",
            totalAgendamentos: customerAppointments.length,
            ultimoAgendamento: lastAppointment
              ? new Date(lastAppointment.scheduled_at).toLocaleDateString("pt-BR")
              : "—",
          }
        })
        setCustomers(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleViewHistory = async (customer: Customer) => {
    setSelectedCustomer(customer)
    setLoadingHistory(true)

    const shopId = getBarberShopIdFromToken()
    const token = getToken()
    if (!shopId || !token) return

    try {
      const data = await fetch(
        `${BASE_URL}/appointments?barber_shop_id=${shopId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((r) => r.json())

      const customerHistory = data
        .filter((a: any) => a.customers?.id === customer.id)
        .sort((a: any, b: any) =>
          new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
        )
      setHistory(customerHistory)
    } catch {}
    finally { setLoadingHistory(false) }
  }

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers
    const term = searchTerm.toLowerCase()
    return customers.filter(
      (c) => c.name.toLowerCase().includes(term) || c.phone.includes(term)
    )
  }, [searchTerm, customers])

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendente", color: "text-yellow-500" },
    confirmed: { label: "Confirmado", color: "text-green-500" },
    cancelled: { label: "Cancelado", color: "text-red-500" },
    completed: { label: "Concluído", color: "text-zinc-400" },
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="mt-1 text-muted-foreground">Gerencie os clientes da sua barbearia</p>
          </div>

          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <div className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Nome</TableHead>
                    <TableHead className="text-muted-foreground">Telefone</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground text-center">Agendamentos</TableHead>
                    <TableHead className="text-muted-foreground">Último agendamento</TableHead>
                    <TableHead className="text-muted-foreground text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                          {customer.totalAgendamentos}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{customer.ultimoAgendamento}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => handleViewHistory(customer)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver histórico
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Total de clientes: <span className="font-semibold text-foreground">{filteredCustomers.length}</span>
          </div>
        </div>
      </main>

      {/* Modal histórico */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selectedCustomer.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingHistory ? (
              <p className="text-muted-foreground text-center py-8">Carregando histórico...</p>
            ) : history.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum agendamento encontrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Data</TableHead>
                    <TableHead className="text-muted-foreground">Barbeiro</TableHead>
                    <TableHead className="text-muted-foreground">Serviço</TableHead>
                    <TableHead className="text-muted-foreground">Valor</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((a) => (
                    <TableRow key={a.id} className="border-border">
                      <TableCell className="text-foreground">
                        {new Date(a.scheduled_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.barbers?.name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{a.services?.name || "—"}</TableCell>
                      <TableCell className="text-foreground">
                        R$ {(a.services?.price || 0).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className={statusMap[a.status]?.color || "text-muted-foreground"}>
                        {statusMap[a.status]?.label || a.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}