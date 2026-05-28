"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Básico",
    price: "R$39",
    period: "/mês",
    description: "Perfeito para barbearias iniciantes",
    features: [
      "Até 100 agendamentos/mês",
      "Até 3 profissionais",
      "Link de agendamento",
      "Lembretes por e-mail",
      "Suporte por e-mail",
    ],
    cta: "Assinar agora",
    popular: false,
  },
  {
    name: "Pro",
    price: "R$79",
    period: "/mês",
    description: "Para barbearias em crescimento",
    features: [
      "Agendamentos ilimitados",
      "Até 10 profissionais",
      "Lembretes via WhatsApp",
      "Painel de métricas",
      "Integração com calendário",
      "Suporte prioritário",
    ],
    cta: "Assinar agora",
    popular: true,
  },
  {
    name: "Premium",
    price: "R$149",
    period: "/mês",
    description: "Para redes e franquias",
    features: [
      "Tudo do Pro +",
      "Profissionais ilimitados",
      "Multi-unidades",
      "API personalizada",
      "Relatórios avançados",
      "Gerente de sucesso dedicado",
    ],
    cta: "Assinar agora",
    popular: false,
  },
]

export function Pricing() {
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
            Planos para cada tamanho de negócio
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comece gratuitamente por 14 dias. Sem compromisso.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                plan.popular
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    Mais popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-6 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
