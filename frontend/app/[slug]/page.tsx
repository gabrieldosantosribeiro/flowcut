import { BookingFlow } from "@/components/booking/booking-flow"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Barbearia Alpha</h1>
            <p className="text-xs text-muted-foreground">Agendamento Online</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>Powered by</span>
            <span className="font-semibold text-primary">FlowCut</span>
          </div>
        </div>
      </header>

      {/* Booking Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <BookingFlow />
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-lg mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Barbearia Alpha. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}
