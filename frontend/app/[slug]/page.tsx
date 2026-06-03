"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { BookingFlow } from "@/components/booking/booking-flow"
import { getPublicBarberShop } from "@/lib/api"

interface BarberShop {
  id: string
  name: string
  slug: string
}

export default function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [barberShop, setBarberShop] = useState<BarberShop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublicBarberShop(slug)
      .then(setBarberShop)
      .catch(() => setError("Barbearia não encontrada"))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  )

  if (error || !barberShop) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-destructive">Barbearia não encontrada.</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{barberShop.name}</h1>
            <p className="text-xs text-muted-foreground">Agendamento Online</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>Powered by</span>
            <span className="font-semibold text-primary">FlowCut</span>
          </div>
        </div>
      </header>
      <div className="max-w-lg mx-auto px-4 py-6">
        <BookingFlow barberShopId={barberShop.id} />
      </div>
      <footer className="border-t border-border mt-auto">
        <div className="max-w-lg mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 {barberShop.name}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}