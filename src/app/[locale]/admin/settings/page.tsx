import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Actualiza las preferencias del sistema o tu cuenta.</p>
      </div>

      <Separator />

      <form className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="siteName">Nombre del sitio</Label>
          <Input id="siteName" placeholder="Mi aplicación" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo del administrador</Label>
          <Input id="email" type="email" placeholder="admin@miapp.com" />
        </div>

        <Button type="submit">Guardar cambios</Button>
      </form>
    </div>
  )
}