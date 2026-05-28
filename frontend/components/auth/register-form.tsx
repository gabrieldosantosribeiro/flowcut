"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 7)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 11)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="barbershop-name">Nome da barbearia</Label>
        <Input
          id="barbershop-name"
          type="text"
          placeholder="Barbearia Premium"
          className="bg-secondary border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="owner-name">Seu nome</Label>
        <Input
          id="owner-name"
          type="text"
          placeholder="João Silva"
          className="bg-secondary border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-register">Email</Label>
        <Input
          id="email-register"
          type="email"
          placeholder="seu@email.com"
          className="bg-secondary border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={handlePhoneChange}
          className="bg-secondary border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-register">Senha</Label>
        <div className="relative">
          <Input
            id="password-register"
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

      <div className="space-y-2">
        <Label htmlFor="password-confirm">Confirmar senha</Label>
        <div className="relative">
          <Input
            id="password-confirm"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="bg-secondary border-border pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <Label
          htmlFor="terms"
          className="text-sm font-normal text-muted-foreground cursor-pointer leading-relaxed"
        >
          Aceito os{" "}
          <a href="#" className="text-primary hover:underline">
            termos de uso
          </a>
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={!termsAccepted}>
        Criar minha conta
      </Button>
    </form>
  )
}
