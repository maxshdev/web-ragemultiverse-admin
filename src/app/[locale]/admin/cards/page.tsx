// web-ragemultiverse-admin\src\app\[locale]\admin\cards\page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, getCardColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function CardsPage() {
  const [data, setData] = useState<Card[]>([]);
  const t = useTranslations("Admin");
  const columns = getCardColumns(t);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Error al cargar usuarios");

        const json = await res.json();

        const cards: Card[] = json.map((card: any) => ({
          id: card.id,
          code: card.code,
          name: card.name,
          rarity: card.rarity,
          attribute: card.attribute,
          species: card.species,
          cost: card.cost,
          mission: card.mission,
          legend: card.legend,
          damage: card.damage,
          version: card.version,
          image: card.image,
          created_at: card.created_at,
          updated_at: card.updated_at,
        }));

        setData(cards);
      } catch (err) {
        console.error(err);
        toast("Error", {
          description: "No se pudo cargar la lista de usuarios.",
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}