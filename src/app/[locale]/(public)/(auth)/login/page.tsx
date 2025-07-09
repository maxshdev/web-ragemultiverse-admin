// app/(public)/(auth)/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          password: formData.password, 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const { user } = await res.json();

      // Guardar token
      localStorage.setItem('token', user.access_token);

      // Guardar datos del usuario (solo los que necesitás)
      localStorage.setItem('user', JSON.stringify({
        name: user.name,
        email: user.email,
        avatar: "/avatars/default.jpg" // o podés modificar esto si viene desde el backend
      }));

      toast("Inicio de sesión exitoso", {
        description: "Redirigiendo…",
      });

      router.push('/admin/dashboard');

    } catch (err: any) {
      setError(err.message);
      toast("Error al iniciar sesión", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
      <p className="text-muted-foreground">
        Ingresa tus credenciales para continuar.
      </p>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Validando…" : "Ingresar"}
        </Button>
      </form>
    </div>
  )
}