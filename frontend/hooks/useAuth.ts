"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, logout as clearAuth } from "@/lib/api"

export function useAuth() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = getToken()

    if (!storedToken) {
      router.replace("/login")
      setIsLoading(false)
      return
    }

    setToken(storedToken)
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setIsAuthenticated(false)
    router.replace("/login")
  }, [router])

  return { isAuthenticated, token, logout, isLoading }
}
