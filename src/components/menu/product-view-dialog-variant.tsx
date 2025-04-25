import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import { IProductVariant } from "@/types/product-variant";
import { Complement } from "./product-view-dialog-category";
import { cn } from "@/lib/utils";

export default function ProductViewDialogVariant({
  productVariant,
  complements,
  setComplements,
  disabled,
  type,
}: {
  productVariant: IProductVariant;
  complements: Complement[];
  setComplements: Dispatch<SetStateAction<Complement[]>>;
  disabled: (complement: Complement) => boolean;
  type: "SINGLE" | "MULTIPLE";
}) {
  const selected = useMemo(
    () =>
      complements
        .map((complement) => complement.variantId)
        .includes(productVariant.id),
    [complements, productVariant.id]
  );
  const handleComplementsToggle = (variant: Complement) => {
    if (type === "SINGLE") {
      const complementsFromOtherCategories = complements.filter(
        (complement) => complement.categoryId !== variant.categoryId
      );
      setComplements([...complementsFromOtherCategories, variant]);
      return;
    }

    if (selected) {
      setComplements(
        complements.filter(
          (complement) => complement.variantId !== variant.variantId
        )
      );
    } else {
      if (disabled(variant)) {
        return;
      }
      setComplements(
        complements.concat({
          categoryId: productVariant.productVariantCategoryId,
          variantId: variant.variantId,
          productId: variant.productId,
        })
      );
    }
  };

  return (
    <div
      key={productVariant.id}
      className={cn(
        "flex items-center space-x-2 rounded-md border p-3 cursor-pointer",
        {
          "border-[#73067D] bg-purple-50 dark:bg-purple-950/20": selected,
          "opacity-50":
            !selected &&
            disabled({
              categoryId: productVariant.productVariantCategoryId,
              variantId: productVariant.id,
              productId: productVariant.productId,
            }) &&
            type === "MULTIPLE",
        }
      )}
      onClick={() =>
        handleComplementsToggle({
          categoryId: productVariant.productVariantCategoryId,
          variantId: productVariant.id,
          productId: productVariant.productId,
        })
      }
    >
      <div
        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
          selected ? "border-[#73067D] bg-[#73067D]" : "border-gray-300"
        }`}
      >
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>
      <Label className="flex-1 cursor-pointer">{productVariant.name}</Label>
      <Badge variant="outline">
        +
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(productVariant.price)}
      </Badge>
    </div>
  );
}
