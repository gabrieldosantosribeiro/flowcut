"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressSteps } from "@/components/booking/progress-steps"
import { BarberSelection } from "@/components/booking/barber-selection"
import { ServiceSelection } from "@/components/booking/service-selection"
import { TimeSelection } from "@/components/booking/time-selection"
import { CustomerForm } from "@/components/booking/customer-form"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { ArrowLeft } from "lucide-react"

const STEPS = ["Barbeiro", "Serviço", "Horário", "Dados"]

const BARBERS = [
  { id: "1", name: "Carlos Silva", specialty: "Especialista em degradê", initials: "CS" },
  { id: "2", name: "André Costa", specialty: "Mestre em barba", initials: "AC" },
  { id: "3", name: "Felipe Rocha", specialty: "Corte clássico e moderno", initials: "FR" },
]

const SERVICES = [
  { id: "1", name: "Corte Degradê", description: "Corte moderno com degradê", price: 45, duration: 45 },
  { id: "2", name: "Corte + Barba", description: "Combo completo", price: 70, duration: 60 },
  { id: "3", name: "Barba Completa", description: "Barba alinhada com toalha quente", price: 35, duration: 30 },
  { id: "4", name: "Corte Social", description: "Corte tradicional elegante", price: 40, duration: 40 },
]

const UNAVAILABLE_SLOTS = ["11:00", "15:00"]

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedBarber !== null
      case 2:
        return selectedService !== null
      case 3:
        return selectedTime !== null
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsConfirmed(true)
  }

  const handleNewBooking = () => {
    setCurrentStep(1)
    setSelectedBarber(null)
    setSelectedService(null)
    setSelectedDate(new Date())
    setSelectedTime(null)
    setCustomerData({ name: "", phone: "", email: "" })
    setIsConfirmed(false)
  }

  const getBarber = () => BARBERS.find((b) => b.id === selectedBarber)
  const getService = () => SERVICES.find((s) => s.id === selectedService)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  if (isConfirmed) {
    return <BookingConfirmation onNewBooking={handleNewBooking} />
  }

  return (
    <div className="space-y-6">
      <ProgressSteps currentStep={currentStep} steps={STEPS} />

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <BarberSelection
            barbers={BARBERS}
            selectedBarber={selectedBarber}
            onSelect={setSelectedBarber}
          />
        )}

        {currentStep === 2 && (
          <ServiceSelection
            services={SERVICES}
            selectedService={selectedService}
            onSelect={setSelectedService}
          />
        )}

        {currentStep === 3 && (
          <TimeSelection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeSelect={setSelectedTime}
            unavailableSlots={UNAVAILABLE_SLOTS}
          />
        )}

        {currentStep === 4 && (
          <CustomerForm
            customerData={customerData}
            onChange={setCustomerData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            summary={{
              barberName: getBarber()?.name || "",
              serviceName: getService()?.name || "",
              servicePrice: getService()?.price || 0,
              date: formatDate(selectedDate),
              time: selectedTime || "",
            }}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {currentStep > 1 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            Continuar
          </Button>
        </div>
      )}
    </div>
  )
}
