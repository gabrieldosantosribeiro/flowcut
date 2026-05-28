"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

const data = [
  { name: "Corte + Barba", value: 42 },
  { name: "Corte Degradê", value: 35 },
  { name: "Barba", value: 28 },
  { name: "Corte Social", value: 22 },
  { name: "Sobrancelha", value: 15 },
]

export function PopularServicesChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Serviços mais populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              width={110}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              maxBarSize={28}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? "#22c55e" : "#1a3d2a"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
