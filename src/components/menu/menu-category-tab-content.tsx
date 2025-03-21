import React from "react";
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
  if (category.products.length === 0) {
    return null;
  }

  return (
    <div id={category.id} className="space-y-2">
      <div className="w-full p-2 flex items-center">
        <h2 className="text-2xl font-bold">{category.name}</h2>
      </div>
      <div className="flex-1 outline-none">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {category.products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden cursor-pointer transition-all hover:shadow-md pt-0 pb-0 md:pb-6 flex flex-row md:flex-col gap-0"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative h-36 w-36 md:h-48 md:w-full">
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
                  <div className="font-semibold text-purple-600 hidden">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1 h-14">
                  {product.description}
                </p>
                <div className="font-semibold text-purple-600 flex md:hidden">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 hidden md:flex">
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
      </div>
    </div>
  );
}
