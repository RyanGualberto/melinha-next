import React, { Dispatch, SetStateAction } from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import { IProductVariant } from "@/types/product-variant";

export default function ProductViewDialogVariant({
  productVariant,
  complements,
  setComplements,
}: {
  productVariant: IProductVariant;
  complements: string[];
  setComplements: Dispatch<SetStateAction<string[]>>;
}) {
  const handleComplementsToggle = (variantId: string) => {
    if (complements.includes(variantId)) {
      setComplements(complements.filter((id) => id !== variantId));
    } else {
      setComplements([...complements, variantId]);
    }
  };

  return (
    <div
      key={productVariant.id}
      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
        complements.includes(productVariant.id)
          ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
          : ""
      }`}
      onClick={() => handleComplementsToggle(productVariant.id)}
    >
      <div
        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
          complements.includes(productVariant.id)
            ? "border-purple-600 bg-purple-600"
            : "border-gray-300"
        }`}
      >
        {complements.includes(productVariant.id) && (
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
