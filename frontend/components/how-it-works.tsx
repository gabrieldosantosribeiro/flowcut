"use client"

import { motion } from "framer-motion"
import { UserPlus, Settings, CalendarCheck } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description: "Cadastre-se gratuitamente em menos de 2 minutos. Sem cartão de crédito.",
  },
  {
    icon: Settings,
    number: "02",
    title: "Configure sua barbearia",
    description: "Adicione seus serviços, horários e profissionais de forma simples e rápida.",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Comece a receber agendamentos",
    description: "Compartilhe seu link e receba agendamentos automaticamente 24 horas por dia.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Como funciona
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comece a usar o FlowCut em 3 passos simples
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-border" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary bg-background mb-6">
                <step.icon className="w-7 h-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.number.slice(-1)}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
