"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowCutLogo } from "@/components/auth/flowcut-logo"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export function AuthPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Tagline */}
        <div className="space-y-2">
          <FlowCutLogo />
          <p className="text-sm text-muted-foreground">
            Gerencie sua barbearia com inteligência
          </p>
        </div>

        {/* Tabs de Autenticação */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              Criar conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
