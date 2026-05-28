"use client"

import { 
  Home, 
  Calendar, 
  Users, 
  Scissors, 
  User, 
  Settings, 
  LogOut 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeItem?: string
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "agendamentos", label: "Agendamentos", icon: Calendar },
  { id: "barbeiros", label: "Barbeiros", icon: Users },
  { id: "servicos", label: "Serviços", icon: Scissors },
  { id: "clientes", label: "Clientes", icon: User },
  { id: "configuracoes", label: "Configurações", icon: Settings },
]

export function Sidebar({ activeItem = "dashboard" }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Scissors className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">FlowCut</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activeItem
          
          return (
            <button
              key={item.id}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <span className="text-xs font-semibold text-primary">BA</span>
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-foreground">Barbearia Alpha</p>
            <p className="text-xs text-muted-foreground">Plano Premium</p>
          </div>
        </div>
        
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
