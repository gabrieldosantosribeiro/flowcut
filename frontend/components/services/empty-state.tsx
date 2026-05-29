"use client"

import { Plus, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ServicesEmptyStateProps {
  onAddService: () => void
}

export function ServicesEmptyState({ onAddService }: ServicesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Scissors className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Nenhum serviço cadastrado
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Adicione seu primeiro serviço para começar
      </p>
      <Button
        onClick={onAddService}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar primeiro serviço
      </Button>
    </div>
  )
}
