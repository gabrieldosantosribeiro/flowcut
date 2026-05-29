"use client"

import { UserPlus, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onAddBarber: () => void
}

export function EmptyState({ onAddBarber }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Scissors className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Nenhum barbeiro cadastrado
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Adicione seu primeiro barbeiro para começar
      </p>
      <Button
        onClick={onAddBarber}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Adicionar primeiro barbeiro
      </Button>
    </div>
  )
}
