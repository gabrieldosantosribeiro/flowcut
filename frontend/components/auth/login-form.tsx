"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-login">Email</Label>
        <Input
          id="email-login"
          type="email"
          placeholder="seu@email.com"
          className="bg-secondary border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-login">Senha</Label>
        <div className="relative">
          <Input
            id="password-login"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="bg-secondary border-border pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Entrar
      </Button>

      <div className="text-center">
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Esqueceu sua senha?
        </a>
      </div>
    </form>
  )
}
