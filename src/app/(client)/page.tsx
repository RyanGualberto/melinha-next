"use client";
import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { ProductViewDialog } from "@/components/menu/product-view-dialog";
import { IProduct } from "@/types/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listMenu } from "@/requests/menu";
import { MenuTabs } from "@/components/menu/menu-tabs";
import MenuCategoryTabContent from "@/components/menu/menu-category-tab-content";
import { Input } from "@/components/ui/input";
import { AlertCircle, Clock, DollarSign, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSettings } from "@/requests/settings";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CardapioPage() {
  const [query, setQuery] = useState("");
  const { data: menu } = useQuery({
    queryKey: ["client-menu"],
    queryFn: async () => await listMenu(query),
  });
  const { data: storeConfig } = useQuery({
    queryKey: ["store-config"],
    queryFn: async () => await getSettings(),
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
    <div className="container px-4 md:px-0 py-8 w-full flex-1 scroll-smooth">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cardápio</h1>
        <p className="text-muted-foreground">
          Escolha seu açaí favorito e personalize com nossas opções, frutas e
          complementos a vontade, peça agora!
        </p>
      </div>

      {storeConfig && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 text-sm bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          >
            <DollarSign className="h-3.5 w-3.5" />
            Pedido mínimo:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(storeConfig?.orderMinimum)}
          </Badge>

          <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <Clock className="h-3.5 w-3.5" />
            Tempo de entrega: {storeConfig?.deliveryTime}
          </Badge>

          <Badge
            variant={storeConfig?.opened ? "default" : "destructive"}
            className={cn("px-3 py-1 text-sm", {
              "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800":
                storeConfig?.opened,
              "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300 border-red-200 dark:border-red-800":
                !storeConfig?.opened,
            })}
          >
            {storeConfig?.opened ? "Aberto" : "Fechado"}
          </Badge>
        </div>
      )}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <div className="mb-6 overflow-auto sticky left-0 pb-0.5 top-[65px] z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full pt-3">
          {storeConfig && !storeConfig.opened && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Loja Fechada</AlertTitle>
              <AlertDescription>
                Nossa loja está fechada no momento. Você pode navegar pelo
                cardápio, mas não será possível realizar pedidos.
              </AlertDescription>
            </Alert>
          )}
          <Input
            icon={<Search size={14} />}
            placeholder="Pesquisar produtos"
            className="mb-2 bg-background"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
    </div>
  );
}
