"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Scissors } from "lucide-react"

const footerLinks = {
  produto: [
    { name: "Funcionalidades", href: "#" },
    { name: "Preços", href: "#" },
    { name: "Integrações", href: "#" },
    { name: "Atualizações", href: "#" },
  ],
  recursos: [
    { name: "Central de ajuda", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Guias", href: "#" },
    { name: "API Docs", href: "#" },
  ],
  empresa: [
    { name: "Sobre nós", href: "#" },
    { name: "Carreiras", href: "#" },
    { name: "Contato", href: "#" },
    { name: "Parceiros", href: "#" },
  ],
  legal: [
    { name: "Termos de uso", href: "#" },
    { name: "Privacidade", href: "#" },
    { name: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Scissors className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">FlowCut</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A plataforma de agendamento mais completa para barbearias do Brasil.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-muted-foreground text-sm">
            © 2024 FlowCut. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              YouTube
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
