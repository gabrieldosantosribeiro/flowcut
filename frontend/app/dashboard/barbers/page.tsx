"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Sidebar } from "@/components/dashboard/sidebar"
import { BarberCard, type Barber } from "@/components/barbers/barber-card"
import { BarberModal } from "@/components/barbers/barber-modal"
import { EmptyState } from "@/components/barbers/empty-state"
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
  createBarber,
  deleteBarber,
  getBarberShopIdFromToken,
  getBarbers,
  updateBarber,
} from "@/lib/api"

interface ApiBarber {
  id: string
  barber_shop_id: string
  name: string
  bio?: string | null
  active: boolean
}

function mapApiBarberToUi(barber: ApiBarber): Barber {
  return {
    id: barber.id,
    name: barber.name,
    specialty: barber.bio || "",
    status: barber.active ? "ativo" : "inativo",
  }
}

export default function BarbeirosPage() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [barberShopId, setBarberShopId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [barberToDelete, setBarberToDelete] = useState<Barber | null>(null)

  const loadBarbers = useCallback(async (shopId: string) => {
    setLoading(true)
    setError(null)

    try {
      const data: ApiBarber[] = await getBarbers(shopId)
      setBarbers(data.map(mapApiBarberToUi))
    } catch {
      setError("Não foi possível carregar os barbeiros.")
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
    loadBarbers(shopId)
  }, [loadBarbers])

  const handleAddBarber = () => {
    setEditingBarber(null)
    setModalOpen(true)
  }

  const handleEditBarber = (barber: Barber) => {
    setEditingBarber(barber)
    setModalOpen(true)
  }

  const handleDeleteBarber = (barber: Barber) => {
    setBarberToDelete(barber)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!barberToDelete || !barberShopId) return

    setSaving(true)
    setError(null)

    try {
      await deleteBarber(barberToDelete.id)
      setBarberToDelete(null)
      setDeleteDialogOpen(false)
      await loadBarbers(barberShopId)
    } catch {
      setError("Não foi possível excluir o barbeiro.")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBarber = async (
    barber: Omit<Barber, "id"> & { id?: string }
  ) => {
    if (!barberShopId) return

    setSaving(true)
    setError(null)

    try {
      if (barber.id) {
        await updateBarber(barber.id, {
          name: barber.name,
          bio: barber.specialty || undefined,
          active: barber.status === "ativo",
        })
      } else {
        await createBarber({
          barber_shop_id: barberShopId,
          name: barber.name,
          bio: barber.specialty || undefined,
          active: barber.status === "ativo",
        })
      }

      setModalOpen(false)
      await loadBarbers(barberShopId)
    } catch {
      setError(
        barber.id
          ? "Não foi possível atualizar o barbeiro."
          : "Não foi possível criar o barbeiro."
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
          <h1 className="text-3xl font-bold text-foreground">Barbeiros</h1>
          <Button
            onClick={handleAddBarber}
            disabled={loading || saving || !barberShopId}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar barbeiro
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
        ) : barbers.length === 0 ? (
          <EmptyState onAddBarber={handleAddBarber} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                onEdit={handleEditBarber}
                onDelete={handleDeleteBarber}
              />
            ))}
          </div>
        )}

        <BarberModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          barber={editingBarber}
          onSave={handleSaveBarber}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Tem certeza que deseja excluir o barbeiro{" "}
                <span className="font-medium text-foreground">
                  {barberToDelete?.name}
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
