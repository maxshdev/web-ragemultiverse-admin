"use client"
import { useTranslations } from 'next-intl';

export default function PublicHomePage() {

  const t = useTranslations("Public");
  
  return (
    <>
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-4xl font-bold">{ t('HomePage.welcome') }</h1>
        <p className="text-lg text-muted-foreground">
          { t('HomePage.about') }
        </p>
      </main>
    </>
  )
}