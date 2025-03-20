"use client";
import { useCallback, useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { ProductViewDialog } from "@/components/menu/product-view-dialog";
import { IProduct } from "@/types/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listMenu } from "@/requests/menu";
import { MenuTabs } from "@/components/menu/menu-tabs";
import MenuCategoryTabContent from "@/components/menu/menu-category-tab-content";
import { Input } from "@/components/ui/input";

export default function CardapioPage() {
  const [query, setQuery] = useState("");
  const { data: menu } = useQuery({
    queryKey: ["client-menu"],
    queryFn: async () => await listMenu(query),
  });
  const queryClient = useQueryClient();
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

  // coloca um debounce no query para invalidar a query
  useEffect(() => {
    const debounce = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["client-menu"] });
    }, 500);

    return () => clearTimeout(debounce);
  }, [query, queryClient]);

  return (
    <div className="container px-4 md:px-0 py-8 w-full flex-1 relative scroll-smooth">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cardápio</h1>
        <p className="text-muted-foreground">
          Escolha seu açaí favorito e personalize com nossas opções, frutas e
          complementos a vontade, peça agora!
        </p>
      </div>

      <Input
        placeholder="Pesquisar produtos"
        className="mb-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

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
