"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface Barber {
  id: string
  name: string
  specialty: string
  status: "ativo" | "inativo"
}

interface BarberCardProps {
  barber: Barber
  onEdit: (barber: Barber) => void
  onDelete: (barber: Barber) => void
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function BarberCard({ barber, onEdit, onDelete }: BarberCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(barber.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{barber.name}</h3>
              <p className="text-sm text-muted-foreground">{barber.specialty}</p>
            </div>
          </div>
          <Badge
            variant={barber.status === "ativo" ? "default" : "secondary"}
            className={
              barber.status === "ativo"
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-muted text-muted-foreground"
            }
          >
            {barber.status === "ativo" ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-border text-foreground hover:bg-secondary"
            onClick={() => onEdit(barber)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(barber)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
