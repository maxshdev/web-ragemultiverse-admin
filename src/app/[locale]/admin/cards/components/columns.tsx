// web-ragemultiverse-admin\src\app\[locale]\admin\cards\components\columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown  } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Card = {
  id: string;
  code: string;
  name: string;
  rarity: string;
  attribute?: string;
  species?: string;
  cost?: number;
  version?: string;
};

export function getCardColumns(t: (key: string) => string): ColumnDef<Card>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: t("Cards.code"),
    },
    {
      accessorKey: "name",
      header: t("Cards.name"),
    },
    {
      accessorKey: "rarity",
      header: t("Cards.rarity"),
    },
    {
      accessorKey: "attribute",
      header: t("Cards.attribute"),
    },
    {
      accessorKey: "species",
      header: t("Cards.species"),
    },
    {
      accessorKey: "cost",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          {t("Cards.cost")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "version",
      header: t("Cards.version"),
    },
    {
      id: "actions",
      header: t("Conmon.actions"),
      cell: ({ row }) => {
        const router = useRouter();
        const rowSelected = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{ t("Conmon.open_menu") }</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{ t("Conmon.actions") }</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(rowSelected.id)}>{ t("Conmon.show") }</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`./cards/${rowSelected.id}`)}>{ t("Conmon.edit") }</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(rowSelected.id)}>{ t("Conmon.delete") }</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];
}