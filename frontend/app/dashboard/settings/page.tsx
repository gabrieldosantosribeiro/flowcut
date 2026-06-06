"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getToken, getBarberShopIdFromToken } from "@/lib/api"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [shopId, setShopId] = useState<string | null>(null)
  const [appUrl, setAppUrl] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    slug: "",
  })

  useEffect(() => {
    setAppUrl(window.location.origin)

    const id = getBarberShopIdFromToken()
    if (!id) { setLoading(false); return }
    setShopId(id)

    const token = getToken()
    if (!token) { setLoading(false); return }

    fetch(`${BASE_URL}/barber-shops/id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((data) => setForm({
        name: data.name || "",
        description: data.description || "",
        phone: data.phone || "",
        address: data.address || "",
        slug: data.slug || "",
      }))
      .catch(() => setError("Erro ao carregar dados da barbearia."))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!shopId) return

    setError(null)

    if (!form.name.trim()) {
      setError("Nome da barbearia é obrigatório.")
      return
    }
    if (form.name.trim().length < 2) {
      setError("Nome deve ter pelo menos 2 caracteres.")
      return
    }
    if (form.name.trim().length > 80) {
      setError("Nome deve ter no máximo 80 caracteres.")
      return
    }
    if (form.description && form.description.length > 500) {
      setError("Descrição deve ter no máximo 500 caracteres.")
      return
    }
    if (form.address && form.address.length > 200) {
      setError("Endereço deve ter no máximo 200 caracteres.")
      return
    }

    setSaving(true)
    setSuccess(false)

    const token = getToken()
    try {
      const res = await fetch(`${BASE_URL}/barber-shops/${shopId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description || undefined,
          phone: form.phone || undefined,
          address: form.address || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Não foi possível salvar as alterações.")
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${appUrl}/${form.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="mt-1 text-muted-foreground">Gerencie as configurações da sua barbearia</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <div className="space-y-6 max-w-2xl">

            {/* Perfil da Barbearia */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Perfil da Barbearia</h2>
                <p className="text-sm text-muted-foreground">Informações públicas sobre o seu estabelecimento</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nome da barbearia <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={80}
                  placeholder="Ex: Barbearia Alpha"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground text-right">{form.name.length}/80</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  maxLength={500}
                  rows={3}
                  placeholder="Conte um pouco sobre sua barbearia..."
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{form.description.length}/500</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Telefone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Endereço</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  maxLength={200}
                  placeholder="Rua das Flores, 123 - Centro, São Paulo - SP"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground text-right">{form.address.length}/200</p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-500">✓ Alterações salvas com sucesso!</p>}

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>

            {/* Link público */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Link público</h2>
                <p className="text-sm text-muted-foreground">Compartilhe este link com seus clientes</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-muted-foreground text-sm select-all truncate">
                  {appUrl}/{form.slug}
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-secondary hover:bg-secondary/80 text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors text-sm whitespace-nowrap"
                >
                  {copied ? "✓ Copiado!" : "Copiar link"}
                </button>
              </div>
            </div>

            {/* Plano atual */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Plano atual</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-medium">Plano Pro</span>
                  <span className="bg-green-500/10 text-green-500 text-xs font-medium px-2 py-1 rounded-full">Ativo</span>
                </div>
                <button className="border border-border text-foreground font-medium px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
                  Gerenciar plano
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}