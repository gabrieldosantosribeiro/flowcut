"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TimeSelectionProps {
  selectedDate: Date
  selectedTime: string | null
  onDateChange: (date: Date) => void
  onTimeSelect: (time: string) => void
  unavailableSlots: string[]
  availableSlots?: string[]
}

const defaultTimeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  const start = new Date(startDate)
  start.setDate(start.getDate() - start.getDay())
  for (let i = 0; i < 7; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    days.push(day)
  }
  return days
}

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

export function TimeSelection({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeSelect,
  unavailableSlots,
  availableSlots,
}: TimeSelectionProps) {
  const weekDays = getWeekDays(selectedDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const slotsToShow = availableSlots && availableSlots.length > 0 
    ? availableSlots 
    : defaultTimeSlots

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    onDateChange(newDate)
  }

  const isDateDisabled = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today || date.getDay() === 0
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Escolha o horário</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek("prev")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium text-foreground">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek("next")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const isSelected = selectedDate.toDateString() === day.toDateString()
            const isDisabled = isDateDisabled(day)
            return (
              <button
                key={index}
                onClick={() => !isDisabled && onDateChange(day)}
                disabled={isDisabled}
                className={cn(
                  "flex flex-col items-center py-3 px-2 rounded-lg transition-all",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && !isDisabled && "hover:bg-muted",
                  isDisabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className="text-xs">{dayNames[index]}</span>
                <span className="text-lg font-semibold">{day.getDate()}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Horários disponíveis</p>
        {slotsToShow.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum horário disponível para este dia.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slotsToShow.map((time) => {
              const isUnavailable = unavailableSlots.includes(time)
              const isSelected = selectedTime === time
              return (
                <button
                  key={time}
                  onClick={() => !isUnavailable && onTimeSelect(time)}
                  disabled={isUnavailable}
                  className={cn(
                    "py-3 px-4 rounded-lg font-medium text-sm transition-all",
                    isSelected && "bg-primary text-primary-foreground",
                    !isSelected && !isUnavailable && "bg-muted text-foreground hover:bg-muted/80",
                    isUnavailable && "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
                  )}
                >
                  {time}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}