"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { registerBarberShop } from "@/lib/api"
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

function formatErrorMessage(detail: unknown): string {
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item === "object" && item !== null && "msg" in item
          ? String((item as { msg: string }).msg)
          : String(item)
      )
      .join(", ")
  }
  return "Erro ao cadastrar"
}

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [barberShopName, setBarberShopName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)

    try {
      await registerBarberShop({
        barber_shop_name: barberShopName,
        owner_name: ownerName,
        email,
        phone,
        password,
      })
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof Error) {
        setError(formatErrorMessage(err.message))
      } else {
        setError("Erro ao cadastrar")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="barbershop-name">Nome da barbearia</Label>
        <Input
          id="barbershop-name"
          type="text"
          placeholder="Barbearia Premium"
          className="bg-secondary border-border"
          value={barberShopName}
          onChange={(e) => setBarberShopName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="owner-name">Seu nome</Label>
        <Input
          id="owner-name"
          type="text"
          placeholder="João Silva"
          className="bg-secondary border-border"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-register">Email</Label>
        <Input
          id="email-register"
          type="email"
          placeholder="seu@email.com"
          className="bg-secondary border-border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
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
          required
          disabled={loading}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={loading}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={loading}
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
          disabled={loading}
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

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!termsAccepted || loading}
      >
        {loading ? (
          <>
            <Spinner className="mr-2" />
            Criando conta...
          </>
        ) : (
          "Criar minha conta"
        )}
      </Button>
    </form>
  )
}
