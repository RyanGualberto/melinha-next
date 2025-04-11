import React from "react";
import { ICategory } from "@/types/category";
import { IProduct } from "@/types/product";
import ProductCard from "./product-card";

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
    <div id={category.id} className="space-y-3">
      <div className="w-full px-1 flex flex-col">
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <h4 className="">{category.description}</h4>
      </div>
      <div className="flex-1 outline-none">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {category.products
            .sort((a, b) => (a.title < b.title ? 1 : -1))
            .map((product) => (
              <ProductCard
                key={product.id}
                handleProductClick={handleProductClick}
                product={product}
              />
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
