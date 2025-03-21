import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { IProduct } from "@/types/product";

export default function ProductCard({
  product,
  handleProductClick,
}: {
  product: IProduct;
  handleProductClick: (product: IProduct) => void;
}) {
  return (
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
          <div className="font-semibold text-[#73067D] hidden md:flex">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 h-14">
          {product.description}
        </p>
        <div className="font-semibold text-[#73067D] flex md:hidden">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </div>
        <Button className="w-full mt-4 bg-[#73067D] hover:bg-[#73067D]/80 hidden md:flex">
          Escolher
        </Button>
      </CardContent>
    </Card>
  );
}
