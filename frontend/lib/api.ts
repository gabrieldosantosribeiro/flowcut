export const BASE_URL = "http://localhost:8000"

const TOKEN_KEY = "flowcut_token"

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export interface RegisterBarberShopData {
  barber_shop_name: string
  owner_name: string
  email: string
  phone: string
  password: string
}

export interface RegisterBarberShopResponse {
  barber_shop_id: string
  user_id: string
}

export interface LoginBarberShopData {
  email: string
  password: string
}

export interface AuthUser {
  user_id: string
  barber_shop_id: string
  email?: string
}

interface TokenResponse {
  access_token: string
  token_type: string
}

interface JwtPayload {
  sub?: string
  barber_shop_id?: string
  email?: string
  exp?: number
}

function parseErrorMessage(detail: unknown): string {
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "object" && item !== null && "msg" in item) {
          return String((item as { msg: string }).msg)
        }
        return String(item)
      })
      .join(", ")
  }
  return "Erro inesperado na requisição."
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T
    }
    return response.json() as Promise<T>
  }

  let details: unknown
  let message = `Erro ${response.status}`

  try {
    details = await response.json()
    if (
      typeof details === "object" &&
      details !== null &&
      "detail" in details
    ) {
      message = parseErrorMessage((details as { detail: unknown }).detail)
    }
  } catch {
    message = response.statusText || message
  }

  throw new ApiError(message, response.status, details)
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const decoded = atob(normalized)
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

function extractUserFromToken(token: string): AuthUser {
  const payload = decodeJwtPayload(token)

  if (!payload?.sub || !payload.barber_shop_id) {
    throw new ApiError("Token inválido recebido do servidor.", 500)
  }

  return {
    user_id: String(payload.sub),
    barber_shop_id: String(payload.barber_shop_id),
    email: payload.email ? String(payload.email) : undefined,
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false

  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return false

  return Date.now() < payload.exp * 1000
}

export async function registerBarberShop(
  data: RegisterBarberShopData
): Promise<RegisterBarberShopResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return handleResponse<RegisterBarberShopResponse>(response)
}

export async function loginBarberShop(
  data: LoginBarberShopData
): Promise<AuthUser> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const tokenData = await handleResponse<TokenResponse>(response)

  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, tokenData.access_token)
  }

  return extractUserFromToken(tokenData.access_token)
}
