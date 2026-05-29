"use client"

import { Pencil, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  active: boolean
}

interface ServiceCardProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(service.price)

  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
        <Badge
          variant={service.active ? "default" : "secondary"}
          className={
            service.active
              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
              : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
          }
        >
          {service.active ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <p className="mb-4 flex-1 text-sm text-neutral-400">{service.description}</p>

      <div className="mb-4 flex items-center gap-2">
        <Badge variant="outline" className="border-neutral-700 text-neutral-300">
          <Clock className="mr-1 h-3 w-3" />
          {service.duration} min
        </Badge>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
        <span className="text-2xl font-bold text-green-500">{formattedPrice}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(service)}
            className="h-9 w-9 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(service)}
            className="h-9 w-9 text-neutral-400 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
