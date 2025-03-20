"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductViewDialog } from "@/components/products/product-view-dialog";
import { IProduct } from "@/types/product";
import { products } from "@/mock/products";

// Dados de exemplo
const categories = [
  { id: "1", name: "Açaí Tradicional" },
  { id: "2", name: "Açaí Especial" },
  { id: "3", name: "Açaí Premium" },
  { id: "4", name: "Complementos" },
];

export default function CardapioPage() {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState(false);

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

      <Tabs defaultValue={categories[0].id} className="w-full">
        <div className="mb-6 overflow-auto">
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
        </div>

        {categories.map((categoria) => (
          <TabsContent key={categoria.id} value={categoria.id} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products
                .filter((product) => product.categoryId === categoria.id)
                .map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{product.title}</h3>
                        <div className="font-medium text-purple-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.price)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                        <Button
                      
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                        Escolher
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {products.filter((product) => product.categoryId === categoria.id)
              .length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum produto disponível nesta categoria.
                </p>
              </div>
            )}
          </TabsContent>
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
