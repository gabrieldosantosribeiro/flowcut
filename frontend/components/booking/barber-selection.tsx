"use client"

import { cn } from "@/lib/utils"

interface Barber {
  id: string
  name: string
  specialty: string
  initials: string
}

interface BarberSelectionProps {
  barbers: Barber[]
  selectedBarber: string | null
  onSelect: (barberId: string) => void
}

export function BarberSelection({ barbers, selectedBarber, onSelect }: BarberSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Escolha o barbeiro</h2>
      <div className="grid gap-3">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
              selectedBarber === barber.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold",
                selectedBarber === barber.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {barber.initials}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{barber.name}</p>
              <p className="text-sm text-muted-foreground">{barber.specialty}</p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-all",
                selectedBarber === barber.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              )}
            >
              {selectedBarber === barber.id && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
