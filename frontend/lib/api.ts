const BASE_URL = "http://localhost:8000"

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
  localStorage.setItem("flowcut_token", result.access_token)
  return result
}

export function getToken() {
  return localStorage.getItem("flowcut_token")
}

export function logout() {
  localStorage.removeItem("flowcut_token")
}
