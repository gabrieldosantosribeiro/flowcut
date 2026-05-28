"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BookingConfirmationProps {
  onNewBooking: () => void
}

export function BookingConfirmation({ onNewBooking }: BookingConfirmationProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Agendamento confirmado!
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Você receberá uma confirmação por WhatsApp. Aguardamos você na Barbearia Alpha!
      </p>
      <Button
        onClick={onNewBooking}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
      >
        Fazer novo agendamento
      </Button>
    </div>
  )
}
