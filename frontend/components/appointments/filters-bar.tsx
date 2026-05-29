"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface FiltersBarProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  barbeiro: string
  onBarbeiroChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  barbeiros: string[]
}

export function FiltersBar({
  date,
  onDateChange,
  barbeiro,
  onBarbeiroChange,
  status,
  onStatusChange,
  barbeiros,
}: FiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start border-border bg-card text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Selecionar data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto border-border bg-popover p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Select value={barbeiro} onValueChange={onBarbeiroChange}>
        <SelectTrigger className="w-[180px] border-border bg-card">
          <SelectValue placeholder="Filtrar por barbeiro" />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover">
          <SelectItem value="todos">Todos os barbeiros</SelectItem>
          {barbeiros.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px] border-border bg-card">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover">
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="confirmado">Confirmado</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
          <SelectItem value="concluido">Concluído</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
