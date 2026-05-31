"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Service } from "./service-card"

interface ServiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service | null
  onSave: (service: Omit<Service, "id"> & { id?: string }) => void | Promise<void>
}

export function ServiceModal({ open, onOpenChange, service, onSave }: ServiceModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (service) {
      setName(service.name)
      setDescription(service.description)
      setPrice(service.price.toString())
      setDuration(service.duration.toString())
      setActive(service.active)
    } else {
      setName("")
      setDescription("")
      setPrice("")
      setDuration("")
      setActive(true)
    }
  }, [service, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      id: service?.id,
      name,
      description,
      price: parseFloat(price) || 0,
      duration: parseInt(duration) || 0,
      active,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neutral-800 bg-neutral-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar serviço" : "Adicionar serviço"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-neutral-300">
              Nome do serviço
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Corte Degradê"
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-green-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-neutral-300">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o serviço..."
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-green-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-neutral-300">
                Preço (R$)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  R$
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  className="border-neutral-700 bg-neutral-800 pl-10 text-white placeholder:text-neutral-500 focus-visible:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-neutral-300">
                Duração (min)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-800 p-3">
            <Label htmlFor="active" className="text-neutral-300">
              Status do serviço
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">
                {active ? "Ativo" : "Inativo"}
              </span>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
