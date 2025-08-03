// app/components/layout/header.tsx
"use client"

// import Link from "next/link";
import { Link } from '@/i18n/navigation';
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export function PublicHeader() {
  
  const t = useTranslations("Public");

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Rage Multiverse Admin
        </Link>
        <nav className="space-x-4">
          <Link href="/">
            <Button variant="ghost">{ t("Header.home") }</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">{ t("Header.login") }</Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost">{ t("Header.register") }</Button>
          </Link>
          <Link href="/contact">
            <Button variant="link">{ t("Header.contact") }</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}