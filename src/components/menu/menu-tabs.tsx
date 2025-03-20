import React from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { ICategory } from "@/types/category";

export function MenuTabs({ categories }: { categories: Array<ICategory> }) {
  return (
    <TabsList className="inline-flex w-full justify-start h-auto p-1 md:justify-center">
      {categories.map((categoria) => (
        <TabsTrigger
          key={categoria.id}
          value={categoria.id}
          className="px-4 py-2 rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          {categoria.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
