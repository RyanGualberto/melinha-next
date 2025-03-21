import React from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { ICategory } from "@/types/category";

export function MenuTabs({ categories }: { categories: Array<ICategory> }) {
  const handleScrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const headerOffset = 140;
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <TabsList className="inline-flex w-full justify-start h-auto p-1 md:justify-center z-50">
      {categories.map((category) => (
        <TabsTrigger
          key={category.id}
          value={category.id}
          onClick={() => handleScrollToSection(category.id)}
          className="px-4 py-2 rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          {category.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
