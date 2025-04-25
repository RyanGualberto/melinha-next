import React, { useEffect, useRef, useState } from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { ICategory } from "@/types/category";

export function MenuTabs({ categories }: { categories: Array<ICategory> }) {
  const [isStuck, setIsStuck] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Detectar sticky ativado
  useEffect(() => {
    const sentinel = document.getElementById("sticky-sentinel");

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting); // Se não estiver visível, sticky ativou
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, []);

  // Detectar overflow lateral para aplicar shadows
  const updateShadows = () => {
    const el = tabsRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    updateShadows();
    el.addEventListener("scroll", updateShadows);
    window.addEventListener("resize", updateShadows);

    return () => {
      el.removeEventListener("scroll", updateShadows);
      window.removeEventListener("resize", updateShadows);
    };
  }, []);

  return (
    <div className="relative">
      <TabsList
        ref={tabsRef}
        className={`inline-flex w-full justify-start h-auto p-1 md:justify-center overflow-x-auto scrollbar-hide max-w-full transition-all duration-300 ${
          isStuck ? "rounded-none shadow-lg" : "rounded-md"
        }`}
      >
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            onClick={() => {
              const section = document.getElementById(category.id);
              if (section) {
                const offset =
                  section.getBoundingClientRect().top + window.scrollY - 110;
                window.scrollTo({ top: offset, behavior: "smooth" });
              }
            }}
            className="text-xs px-2 md:px-4 py-2 rounded-md data-[state=active]:bg-[#73067D] data-[state=active]:text-white"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Shadows laterais */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      )}
    </div>
  );
}
