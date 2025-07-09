// app/(public)/layout.tsx
import { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MaxShDev y RageMultiverse Todos los derechos reservados.
        </div>
      </footer>
    </>
  )
}