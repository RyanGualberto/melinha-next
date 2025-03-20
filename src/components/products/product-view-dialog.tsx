"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/types/product";
import { productVariants } from "@/mock/product-variants";
import { productVariantCategories } from "@/mock/product-variant-categories";

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

  if (!product) return null;

  const handleQuantidadeChange = (delta: number) => {
    const novaQuantidade = quantidade + delta;
    if (novaQuantidade >= 1) {
      setQuantidade(novaQuantidade);
    }
  };

  const handleComplementoToggle = (variantId: string) => {
    if (complements.includes(variantId)) {
      setComplementos(complements.filter((id) => id !== variantId));
    } else {
      setComplementos([...complements, variantId]);
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
    // Aqui você adicionaria a lógica para adicionar ao carrinho
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
            <div key={pvc.id}>
              <h3 className="font-medium mb-3">{pvc.name}</h3>
              <div className="grid grid-cols-1 gap-2">
                {productVariants
                  .filter(
                    (variant) => variant.productVariantCategoryId === pvc.id
                  )
                  .map((variant) => (
                    <div
                      key={variant.id}
                      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                        complements.includes(variant.id)
                          ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                          : ""
                      }`}
                      onClick={() => handleComplementoToggle(variant.id)}
                    >
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          complements.includes(variant.id)
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300"
                        }`}
                      >
                        {complements.includes(variant.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <Label className="flex-1 cursor-pointer">
                        {variant.name}
                      </Label>
                      <Badge variant="outline">
                        +
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(variant.price)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
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
