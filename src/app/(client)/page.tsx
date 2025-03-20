"use client";
import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { ProductViewDialog } from "@/components/menu/product-view-dialog";
import { IProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { listMenu } from "@/requests/menu";
import { MenuTabs } from "@/components/menu/menu-tabs";
import MenuCategoryTabContent from "@/components/menu/menu-category-tab-content";

export default function CardapioPage() {
  const { data: menu } = useQuery({
    queryKey: ["client-menu"],
    queryFn: async () => await listMenu(),
  });
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
    <div className="container py-8 w-full flex-1">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cardápio</h1>
        <p className="text-muted-foreground">
          Escolha seu açaí favorito e personalize com nossas opções
        </p>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <div className="mb-6 overflow-auto">
          <MenuTabs categories={menu?.categories || []} />
        </div>

        {(menu?.categories || []).map((category) => (
          <MenuCategoryTabContent
            key={category.id}
            handleProductClick={handleProductClick}
            category={category}
          />
        ))}
      </Tabs>
      {selectedProduct && (
        <ProductViewDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
