"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProduct } from "@/types/product";
import { productVariants } from "@/mock/product-variants";
import { ProductViewDialogCategory } from "./product-view-dialog-category";
import { IProductVariantCategory } from "@/types/product-variant-category";

interface ProductViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProduct;
}

export function ProductViewDialog({
  open,
  onOpenChange,
  product,
}: ProductViewDialogProps) {
  const router = useRouter();
  const [quantidade, setQuantidade] = useState(1);
  const [complements, setComplementos] = useState<string[]>([]);
  const productVariantCategories = useMemo(() => {
    const allProductVariants = product.productVariants;

    const productVariantsGroupedByCategory = allProductVariants.reduce(
      (acc, variant) => {
        const categoryId = variant.productVariantCategoryId;
        if (!acc.find((acc) => acc.id === categoryId)) {
          acc.push({
            ...variant.productVariantCategory,
            productVariants: allProductVariants.filter(
              (v) => v.productVariantCategoryId === categoryId
            ),
          });
        }
        return acc;
      },
      [] as IProductVariantCategory[]
    );

    return productVariantsGroupedByCategory;
  }, [product]);

  if (!product) return null;

  const handleQuantidadeChange = (delta: number) => {
    const novaQuantidade = quantidade + delta;
    if (novaQuantidade >= 1) {
      setQuantidade(novaQuantidade);
    }
  };

  const calcularPrecoTotal = () => {
    let priceBase = product.price;

    // Adicionar preço dos complements
    complements.forEach((variantId) => {
      const variant = productVariants.find((v) => v.id === variantId);
      if (variant) {
        priceBase += variant.price;
      }
    });

    return priceBase * quantidade;
  };

  const handleAddToCart = () => {
    console.log("Adicionado ao carrinho:", {
      product,
      quantidade,
      complements,
      precoTotal: calcularPrecoTotal(),
    });

    onOpenChange(false);
    router.push("/carrinho");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.title}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="relative h-48 w-full rounded-md overflow-hidden my-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          {productVariantCategories.map((pvc) => (
            <ProductViewDialogCategory
              key={pvc.id}
              productVariantCategory={pvc}
              complements={complements}
              setComplements={setComplementos}
            />
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="flex items-center border rounded-md">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleQuantidadeChange(-1)}
              disabled={quantidade <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center">{quantidade}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleQuantidadeChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Adicionar
            <span className="ml-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(calcularPrecoTotal())}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
