"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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

const initialBarbers: Barber[] = [
  {
    id: "1",
    name: "Carlos Silva",
    specialty: "Cortes clássicos e barba",
    status: "ativo",
  },
  {
    id: "2",
    name: "André Costa",
    specialty: "Degradê e cortes modernos",
    status: "ativo",
  },
  {
    id: "3",
    name: "Felipe Rocha",
    specialty: "Coloração e tratamentos capilares",
    status: "inativo",
  },
]

export default function BarbeirosPage() {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [barberToDelete, setBarberToDelete] = useState<Barber | null>(null)

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

  const confirmDelete = () => {
    if (barberToDelete) {
      setBarbers(barbers.filter((b) => b.id !== barberToDelete.id))
      setBarberToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveBarber = (barber: Omit<Barber, "id"> & { id?: string }) => {
    if (barber.id) {
      setBarbers(
        barbers.map((b) =>
          b.id === barber.id ? { ...barber, id: barber.id } : b
        )
      )
    } else {
      setBarbers([
        ...barbers,
        {
          ...barber,
          id: Date.now().toString(),
        },
      ])
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeItem="barbeiros" />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Barbeiros</h1>
          <Button
            onClick={handleAddBarber}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar barbeiro
          </Button>
        </div>

        {barbers.length === 0 ? (
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
