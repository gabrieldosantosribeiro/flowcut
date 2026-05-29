"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ServiceCard, type Service } from "@/components/services/service-card"
import { ServiceModal } from "@/components/services/service-modal"
import { ServicesEmptyState } from "@/components/services/empty-state"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const initialServices: Service[] = [
  {
    id: "1",
    name: "Corte Degradê",
    description: "Corte moderno com degradê nas laterais",
    price: 45,
    duration: 40,
    active: true,
  },
  {
    id: "2",
    name: "Barba Completa",
    description: "Aparar e finalizar a barba",
    price: 30,
    duration: 25,
    active: true,
  },
  {
    id: "3",
    name: "Corte + Barba",
    description: "Combo completo de corte e barba",
    price: 65,
    duration: 60,
    active: false,
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  const handleAddService = () => {
    setEditingService(null)
    setModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setModalOpen(true)
  }

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter((s) => s.id !== serviceToDelete.id))
      setServiceToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveService = (service: Omit<Service, "id"> & { id?: string }) => {
    if (service.id) {
      setServices(
        services.map((s) =>
          s.id === service.id ? { ...service, id: service.id } : s
        )
      )
    } else {
      setServices([
        ...services,
        {
          ...service,
          id: Date.now().toString(),
        },
      ])
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeItem="servicos" />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <Button
            onClick={handleAddService}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar serviço
          </Button>
        </div>

        {services.length === 0 ? (
          <ServicesEmptyState onAddService={handleAddService} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            ))}
          </div>
        )}

        <ServiceModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          service={editingService}
          onSave={handleSaveService}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Tem certeza que deseja excluir o serviço{" "}
                <span className="font-medium text-foreground">
                  {serviceToDelete?.name}
                </span>
                ? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
