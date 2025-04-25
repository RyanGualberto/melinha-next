"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "../ui/tabs";
import { MenuTabs } from "./menu-tabs";
import { ProductViewDialog } from "./product-view-dialog";
import { IProduct } from "@/types/product";
import MenuCategoryTabContent from "./menu-category-tab-content";
import { IMenuResponse } from "@/requests/menu";

export default function MenuDynamicContentPage({
  menu,
}: {
  menu: IMenuResponse;
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (menu?.categories.length) {
      setSelectedCategory(menu.categories[0].id);
    }
  }, [menu]);

  const handleProductClick = (product: IProduct) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };
  return (
    <>
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <div id="sticky-sentinel" className="h-1"></div>{" "}
        {/* MARCADOR ANTES DO STICKY */}
        <div className="mb-6 overflow-auto sticky left-0 pb-0.5 top-[65px] z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full md:pt-3">
          <MenuTabs categories={menu?.categories || []} />
        </div>
        <div className="flex flex-col gap-5">
          {(menu?.categories || []).map((category) => (
            <MenuCategoryTabContent
              key={category.id}
              handleProductClick={handleProductClick}
              category={category}
            />
          ))}
        </div>
      </Tabs>
      {selectedProduct && (
        <ProductViewDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selectedProduct}
        />
      )}
    </>
  );
}
