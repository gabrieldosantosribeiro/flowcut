import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  cliente: string
  barbeiro: string
  servico: string
  horario: string
  status: "confirmado" | "pendente" | "cancelado"
}

const appointments: Appointment[] = [
  {
    id: "1",
    cliente: "Lucas Oliveira",
    barbeiro: "Carlos Silva",
    servico: "Corte + Barba",
    horario: "09:00",
    status: "confirmado",
  },
  {
    id: "2",
    cliente: "Pedro Santos",
    barbeiro: "André Costa",
    servico: "Corte Degradê",
    horario: "09:30",
    status: "confirmado",
  },
  {
    id: "3",
    cliente: "Rafael Mendes",
    barbeiro: "Carlos Silva",
    servico: "Barba",
    horario: "10:00",
    status: "pendente",
  },
  {
    id: "4",
    cliente: "Bruno Ferreira",
    barbeiro: "André Costa",
    servico: "Corte Social",
    horario: "10:30",
    status: "cancelado",
  },
  {
    id: "5",
    cliente: "Thiago Lima",
    barbeiro: "Carlos Silva",
    servico: "Corte + Sobrancelha",
    horario: "11:00",
    status: "confirmado",
  },
]

const statusConfig = {
  confirmado: {
    label: "Confirmado",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  pendente: {
    label: "Pendente",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
}

export function AppointmentsTable() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Próximos agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Cliente</TableHead>
              <TableHead className="text-muted-foreground">Barbeiro</TableHead>
              <TableHead className="text-muted-foreground">Serviço</TableHead>
              <TableHead className="text-muted-foreground">Horário</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="border-border">
                <TableCell className="font-medium text-foreground">
                  {appointment.cliente}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {appointment.barbeiro}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {appointment.servico}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {appointment.horario}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      statusConfig[appointment.status].className
                    )}
                  >
                    {statusConfig[appointment.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
