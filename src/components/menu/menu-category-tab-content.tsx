import React from "react";
import { TabsContent } from "../ui/tabs";
import { ICategory } from "@/types/category";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { IProduct } from "@/types/product";

export default function MenuCategoryTabContent({
  category,
  handleProductClick,
}: {
  category: ICategory;
  handleProductClick: (product: IProduct) => void;
}) {
  return (
    <TabsContent key={category.id} value={category.id} className="mt-0">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {category.products.map((product) => (
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
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                Escolher
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {category.products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum produto disponível nesta categoria.
          </p>
        </div>
      )}
    </TabsContent>
  );
}
