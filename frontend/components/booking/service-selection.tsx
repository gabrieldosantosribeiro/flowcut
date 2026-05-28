"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
}

interface ServiceSelectionProps {
  services: Service[]
  selectedService: string | null
  onSelect: (serviceId: string) => void
}

export function ServiceSelection({ services, selectedService, onSelect }: ServiceSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Escolha o serviço</h2>
      <div className="grid gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
              selectedService === service.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{service.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{service.duration}min</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">
                R$ {service.price.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 ml-4 transition-all",
                selectedService === service.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              )}
            >
              {selectedService === service.id && (
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
