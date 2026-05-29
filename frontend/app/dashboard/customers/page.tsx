"use client"

import { useState, useMemo } from "react"
import { Search, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"

interface Customer {
  id: string
  nome: string
  telefone: string
  email: string
  totalAgendamentos: number
  ultimoAgendamento: string
}

const customers: Customer[] = [
  {
    id: "1",
    nome: "Carlos Eduardo Silva",
    telefone: "(11) 98765-4321",
    email: "carlos.silva@email.com.br",
    totalAgendamentos: 12,
    ultimoAgendamento: "28/05/2026",
  },
  {
    id: "2",
    nome: "João Pedro Santos",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com.br",
    totalAgendamentos: 8,
    ultimoAgendamento: "27/05/2026",
  },
  {
    id: "3",
    nome: "Lucas Oliveira",
    telefone: "(21) 99876-5432",
    email: "lucas.oliveira@email.com.br",
    totalAgendamentos: 15,
    ultimoAgendamento: "25/05/2026",
  },
  {
    id: "4",
    nome: "Rafael Almeida Costa",
    telefone: "(31) 98888-7777",
    email: "rafael.costa@email.com.br",
    totalAgendamentos: 5,
    ultimoAgendamento: "20/05/2026",
  },
  {
    id: "5",
    nome: "Matheus Ferreira",
    telefone: "(11) 97654-3210",
    email: "matheus.ferreira@email.com.br",
    totalAgendamentos: 22,
    ultimoAgendamento: "29/05/2026",
  },
  {
    id: "6",
    nome: "Bruno Rodrigues Lima",
    telefone: "(21) 96543-2109",
    email: "bruno.lima@email.com.br",
    totalAgendamentos: 9,
    ultimoAgendamento: "22/05/2026",
  },
]

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers
    const term = searchTerm.toLowerCase()
    return customers.filter(
      (customer) =>
        customer.nome.toLowerCase().includes(term) ||
        customer.telefone.includes(term)
    )
  }, [searchTerm])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie os clientes da sua barbearia
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">Nome</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Telefone</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Email</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-center">Total de agendamentos</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Último agendamento</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id} 
                    className="border-border hover:bg-muted/50"
                  >
                    <TableCell className="font-medium text-foreground">
                      {customer.nome}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.telefone}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                        {customer.totalAgendamentos}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.ultimoAgendamento}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver histórico
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={6} 
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Total de clientes: <span className="font-semibold text-foreground">{filteredCustomers.length}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
