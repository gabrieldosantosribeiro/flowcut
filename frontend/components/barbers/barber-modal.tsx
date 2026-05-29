"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Barber } from "@/components/barbers/barber-card"

interface BarberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  barber: Barber | null
  onSave: (barber: Omit<Barber, "id"> & { id?: string }) => void
}

export function BarberModal({
  open,
  onOpenChange,
  barber,
  onSave,
}: BarberModalProps) {
  const [name, setName] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [status, setStatus] = useState<"ativo" | "inativo">("ativo")

  useEffect(() => {
    if (barber) {
      setName(barber.name)
      setSpecialty(barber.specialty)
      setStatus(barber.status)
    } else {
      setName("")
      setSpecialty("")
      setStatus("ativo")
    }
  }, [barber, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: barber?.id,
      name,
      specialty,
      status,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {barber ? "Editar barbeiro" : "Adicionar barbeiro"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nome completo
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-foreground">
              Especialidade/Bio
            </Label>
            <Input
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Digite a especialidade"
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary p-4">
            <div className="space-y-0.5">
              <Label htmlFor="status" className="text-foreground">
                Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {status === "ativo" ? "Barbeiro ativo" : "Barbeiro inativo"}
              </p>
            </div>
            <Switch
              id="status"
              checked={status === "ativo"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "ativo" : "inativo")
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
