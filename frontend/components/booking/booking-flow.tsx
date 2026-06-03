"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProgressSteps } from "@/components/booking/progress-steps"
import { BarberSelection } from "@/components/booking/barber-selection"
import { ServiceSelection } from "@/components/booking/service-selection"
import { TimeSelection } from "@/components/booking/time-selection"
import { CustomerForm } from "@/components/booking/customer-form"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { ArrowLeft } from "lucide-react"
import {
  getPublicBarbers,
  getPublicServices,
  getAvailableSlots,
  createCustomer,
  createPublicAppointment,
} from "@/lib/api"

const STEPS = ["Barbeiro", "Serviço", "Horário", "Dados"]

interface Barber {
  id: string
  name: string
  bio?: string
  initials: string
  specialty: string
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  duration_minutes?: number
}

interface BookingFlowProps {
  barberShopId: string
}

export function BookingFlow({ barberShopId }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerData, setCustomerData] = useState({ name: "", phone: "", email: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    getPublicBarbers(barberShopId).then((data) => {
      setBarbers(data.map((b: any) => ({
        ...b,
        initials: b.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
        specialty: b.bio || "",
      })))
    })
  
    getPublicServices(barberShopId).then((data) => {
      setServices(data.map((s: any) => ({
        ...s,
        description: s.description || "",
        duration: s.duration_minutes || 30,
      })))
    })
  }, [barberShopId])

  useEffect(() => {
    if (selectedBarber && selectedService && currentStep === 3) {
      console.log("buscando slots para:", { selectedBarber, selectedService, currentStep })
      const service = services.find((s) => s.id === selectedService)
      const day = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      console.log("day:", day)
      getAvailableSlots(selectedBarber, day, service?.duration || 30).then((slots) => {
        console.log("slots brutos:", slots)
        const times = slots.map((s: { starts_at: string }) => {
          // Remove timezone e pega apenas a hora
          const timePart = s.starts_at.split("T")[1]?.substring(0, 5)
          return timePart || ""
        }).filter(Boolean)
        setAvailableSlots(times)
      })
    }
  }, [selectedBarber, selectedService, selectedDate, currentStep])

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedBarber !== null
      case 2: return selectedService !== null
      case 3: return selectedTime !== null
      default: return true
    }
  }

  const handleNext = () => {
    if (currentStep < 4 && canProceed()) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setSubmitError(null)
    }
  }

const handleSubmit = async () => {
  setIsSubmitting(true)
  try {
    const customer = await createCustomer({
      barber_shop_id: barberShopId,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email || undefined,
    })

    const [hours, minutes] = selectedTime!.split(":").map(Number)
    const localDate = new Date(selectedDate)
    localDate.setHours(hours, minutes, 0, 0)
    const starts_at = localDate.toISOString()

    await createPublicAppointment({
      barber_shop_id: barberShopId,
      barber_id: selectedBarber!,
      service_id: selectedService!,
      customer_id: customer.id,
      starts_at,
    })

    setIsConfirmed(true)
  } catch (err) {
    if (err instanceof Error && err.message === "Horário já ocupado") {
      setSubmitError("Este horário não está mais disponível. Volte e escolha outro horário.")
      setCurrentStep(3)
    } else {
      setSubmitError("Erro ao criar agendamento. Tente novamente.")
    }
  } finally {  
    setIsSubmitting(false)
  }
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

  const getBarber = () => barbers.find((b) => b.id === selectedBarber)
  const getService = () => services.find((s) => s.id === selectedService)

  const formatDate = (date: Date) =>
    date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })

  if (isConfirmed) return <BookingConfirmation onNewBooking={handleNewBooking} />

  return (
    <div className="space-y-6">
      <ProgressSteps currentStep={currentStep} steps={STEPS} />
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <BarberSelection
            barbers={barbers}
            selectedBarber={selectedBarber}
            onSelect={setSelectedBarber}
          />
        )}
        {currentStep === 2 && (
          <ServiceSelection
            services={services}
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
            unavailableSlots={[]}
            availableSlots={availableSlots}
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
      {submitError && (
        <p className="text-sm text-red-500 text-center py-2">{submitError}</p>
      )}
      {currentStep < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
          {currentStep > 1 ? (
            <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
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