import React, { Dispatch, SetStateAction } from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import { IProductVariant } from "@/types/product-variant";

export default function ProductViewDialogVariant({
  productVariant,
  complements,
  setComplements,
  disabled,
  type,
}: {
  productVariant: IProductVariant;
  complements: {
    categoryId: string;
    variantId: string;
  }[];
  setComplements: Dispatch<
    SetStateAction<
      {
        categoryId: string;
        variantId: string;
      }[]
    >
  >;
  disabled: boolean;
  type: "SINGLE" | "MULTIPLE";
}) {
  const handleComplementsToggle = (variant: {
    categoryId: string;
    variantId: string;
  }) => {

    if (disabled) return;
    if (type === "SINGLE") {
      const complementsFromOtherCategories = complements.filter(
        (complement) => complement.categoryId !== variant.categoryId
      );
      setComplements([...complementsFromOtherCategories, variant]);
      return;
    }

    if (
      complements
        .map((complement) => complement.variantId)
        .includes(variant.variantId)
    ) {
      setComplements(
        complements.filter(
          (complement) => complement.variantId !== variant.variantId
        )
      );
    } else {
      setComplements(
        complements.concat({
          categoryId: productVariant.productVariantCategoryId,
          variantId: variant.variantId,
        })
      );
    }
  };

  return (
    <div
      key={productVariant.id}
      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
        complements
          .map((complement) => complement.variantId)
          .includes(productVariant.id)
          ? "border-[#73067D] bg-purple-50 dark:bg-purple-950/20"
          : ""
      }`}
      onClick={() =>
        handleComplementsToggle({
          categoryId: productVariant.productVariantCategoryId,
          variantId: productVariant.id,
        })
      }
    >
      <div
        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
          complements
            .map((complement) => complement.variantId)
            .includes(productVariant.id)
            ? "border-[#73067D] bg-[#73067D]"
            : "border-gray-300"
        }`}
      >
        {complements
          .map((complement) => complement.variantId)
          .includes(productVariant.id) && (
          <Check className="h-3 w-3 text-white" />
        )}
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
