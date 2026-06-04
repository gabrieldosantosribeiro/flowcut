"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { getAppointments, getBarberShopIdFromToken } from "@/lib/api"

interface ServiceData {
  name: string
  value: number
}

export function PopularServicesChart() {
  const [data, setData] = useState<ServiceData[]>([])

  useEffect(() => {
    const shopId = getBarberShopIdFromToken()
    if (!shopId) return

    getAppointments(shopId)
      .then((appointments: any[]) => {
        const counts: Record<string, number> = {}
        appointments.forEach((a) => {
          const name = a.services?.name
          if (name) counts[name] = (counts[name] || 0) + 1
        })
        const sorted = Object.entries(counts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
        setData(sorted)
      })
      .catch(() => {})
  }, [])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Serviços mais populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum dado disponível ainda.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} width={110} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#22c55e" : "#1a3d2a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}