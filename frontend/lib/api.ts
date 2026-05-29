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
