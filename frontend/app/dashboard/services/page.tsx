"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
import {
  createService,
  deleteService,
  getBarberShopIdFromToken,
  getServices,
  updateService,
} from "@/lib/api"

interface ApiService {
  id: string
  barber_shop_id: string
  name: string
  description?: string | null
  price: number
  duration_minutes: number
  active: boolean
}
function mapApiServiceToUi(service: ApiService): Service {
  return {
    id: service.id,
    name: service.name,
    description: service.description || "",
    price: service.price,
    duration: service.duration_minutes,
    active: service.active,
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [barberShopId, setBarberShopId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  const loadServices = useCallback(async (shopId: string) => {
    setLoading(true)
    setError(null)

    try {
      const data: ApiService[] = await getServices(shopId)
      setServices(data.map(mapApiServiceToUi))
    } catch {
      setError("Não foi possível carregar os serviços.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const shopId = getBarberShopIdFromToken()
    if (!shopId) {
      setError("Barbearia não identificada. Faça login novamente.")
      setLoading(false)
      return
    }

    setBarberShopId(shopId)
    loadServices(shopId)
  }, [loadServices])

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

  const confirmDelete = async () => {
    if (!serviceToDelete || !barberShopId) return

    setSaving(true)
    setError(null)

    try {
      await deleteService(serviceToDelete.id)
      setServiceToDelete(null)
      setDeleteDialogOpen(false)
      await loadServices(barberShopId)
    } catch {
      setError("Não foi possível excluir o serviço.")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveService = async (
    service: Omit<Service, "id"> & { id?: string }
  ) => {
    if (!barberShopId) return

    setSaving(true)
    setError(null)

    try {
      if (service.id) {
        await updateService(service.id, {
          name: service.name,
          description: service.description || undefined,
          price: service.price,
          duration_minutes: service.duration,
          active: service.active,
        })
      } else {
        await createService({
          barber_shop_id: barberShopId,
          name: service.name,
          description: service.description || undefined,
          price: service.price,
          duration_minutes: service.duration,
          active: service.active,
        })
      }

      setModalOpen(false)
      await loadServices(barberShopId)
    } catch {
      setError(
        service.id
          ? "Não foi possível atualizar o serviço."
          : "Não foi possível criar o serviço."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <Button
            onClick={handleAddService}
            disabled={loading || saving || !barberShopId}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar serviço
          </Button>
        </div>

        {error && (
          <p className="mb-6 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-8" />
          </div>
        ) : services.length === 0 ? (
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
              <AlertDialogCancel
                disabled={saving}
                className="border-border text-foreground hover:bg-secondary"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={saving}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {saving ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
