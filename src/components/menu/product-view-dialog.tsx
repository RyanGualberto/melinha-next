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
import { ProductViewDialogCategory } from "./product-view-dialog-category";
import { IProductVariantCategory } from "@/types/product-variant-category";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useCartContext } from "@/contexts/cart-context";

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
  const { handleAddCartItem } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [complements, setComplementos] = useState<
    {
      categoryId: string;
      variantId: string;
      productId: string;
    }[]
  >([]);
  const [observations, setObservations] = useState("");
  const priceItemSubtotal = useMemo(() => {
    let priceBase = product.price;

    complements.forEach(({ variantId }) => {
      const variant = product.productVariants.find((v) => v.id === variantId);
      if (variant) {
        priceBase += variant.price;
      }
    });

    return { subtotal: priceBase * quantity, unit: priceBase };
  }, [product, complements, quantity]);
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

  const handleQuantityChange = (delta: number) => {
    const novaQuantity = quantity + delta;
    if (novaQuantity >= 1) {
      setQuantity(novaQuantity);
    }
  };

  const handleAddToCart = () => {
    handleAddCartItem({
      id: String(Math.random()),
      productId: product.id,
      product,
      quantity,
      unitPrice: priceItemSubtotal.unit,
      price: priceItemSubtotal.subtotal,
      variants: complements.map(({ variantId }) => {
        const variant = product.productVariants.find((v) => v.id === variantId);
        return {
          variantId: variantId || "",
          variantName: variant?.name || "",
          variantPrice: variant?.price || 0,
        };
      }),
      observation: observations,
    });

    onOpenChange(false);
    router.push("/cart");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.title}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="relative h-72 w-full rounded-md overflow-hidden my-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          {productVariantCategories
            .sort((a, b) => {
              const order = [
                "copo 1 - sabor",
                "copo 1 - fruta",
                "copo 1 - complementos",
                "copo 1 - cobertura",
                "copo 1 - adicionais",
                "copo 2 - sabor",
                "copo 2 - fruta",
                "copo 2 - complementos",
                "copo 2 - cobertura",
                "copo 2 - adicionais",
                "frutas",
                "complementos",
                "coberturas",
                "adicionais",
                "colher",
              ];
              return (
                order.indexOf(a.name.toLowerCase()) -
                order.indexOf(b.name.toLowerCase())
              );
            })
            .map((pvc) => (
              <ProductViewDialogCategory
                key={pvc.id}
                productVariantCategory={pvc}
                complements={complements}
                setComplements={setComplementos}
              />
            ))}
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Pouca Granola"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="flex-1 bg-[#73067D] hover:bg-[#73067D]/80"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Adicionar
            <span className="ml-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(priceItemSubtotal.subtotal)}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
