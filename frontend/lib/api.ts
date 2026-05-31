const BASE_URL = "http://localhost:8000"
const TOKEN_KEY = "flowcut_token"

function setAuthCookie(token: string) {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`
}

export async function registerBarberShop(data: {
  barber_shop_name: string
  owner_name: string
  email: string
  phone: string
  password: string
}) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Erro ao cadastrar")
  }
  return res.json()
}

export async function loginBarberShop(data: {
  email: string
  password: string
}) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Erro ao fazer login")
  }
  const result = await res.json()
  localStorage.setItem(TOKEN_KEY, result.access_token)
  setAuthCookie(result.access_token)
  await new Promise(resolve => setTimeout(resolve, 100))
  return result
}

export function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  clearAuthCookie()
}

export function getBarberShopIdFromToken(): string | null {
  const token = getToken()
  if (!token) return null

  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { barber_shop_id?: string }
    return decoded.barber_shop_id ? String(decoded.barber_shop_id) : null
  } catch {
    return null
  }
}

export async function getBarbers(barber_shop_id: string) {
  const token = getToken()
  const res = await fetch(
    `${BASE_URL}/barbers?barber_shop_id=${barber_shop_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!res.ok) throw new Error("Erro ao buscar barbeiros")
  return res.json()
}

export async function createBarber(data: {
  barber_shop_id: string
  name: string
  bio?: string
  active: boolean
}) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/barbers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao criar barbeiro")
  return res.json()
}

export async function updateBarber(
  id: string,
  data: {
    name?: string
    bio?: string
    active?: boolean
  }
) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/barbers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao atualizar barbeiro")
  return res.json()
}

export async function deleteBarber(id: string) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/barbers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Erro ao deletar barbeiro")
  if (res.status === 204) return null
  return res.json()
}

export async function getServices(barber_shop_id: string) {
  const token = getToken()
  const res = await fetch(
    `${BASE_URL}/services?barber_shop_id=${barber_shop_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!res.ok) throw new Error("Erro ao buscar serviços")
  return res.json()
}

export async function createService(data: {
  barber_shop_id: string
  name: string
  description?: string
  price: number
  duration_minutes: number
  active: boolean
}) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao criar serviço")
  return res.json()
}

export async function updateService(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    duration_minutes?: number
    active?: boolean
  }
) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao atualizar serviço")
  return res.json()
}

export async function deleteService(id: string) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Erro ao deletar serviço")
  if (res.status === 204) return null
  return res.json()
}