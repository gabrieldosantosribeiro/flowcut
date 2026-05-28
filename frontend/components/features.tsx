"use client"

import { motion } from "framer-motion"
import { Calendar, LayoutDashboard, Bell } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Agendamento online 24h",
    description: "Seus clientes podem agendar a qualquer momento, direto pelo celular. Sem ligações, sem espera.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel completo",
    description: "Visualize todos os agendamentos, gerencie sua equipe e acompanhe métricas em tempo real.",
  },
  {
    icon: Bell,
    title: "Lembretes automáticos",
    description: "Envio automático de lembretes via WhatsApp e SMS. Reduza faltas em até 70%.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ferramentas poderosas para transformar a gestão da sua barbearia
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
