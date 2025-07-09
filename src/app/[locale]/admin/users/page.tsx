"use client";

import { useEffect, useState } from "react";
import { User, getUserColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const t = useTranslations("Admin");
  const columns = getUserColumns(t);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Error al cargar usuarios");

        const json = await res.json();

        const users: User[] = json.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }));

        setData(users);
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