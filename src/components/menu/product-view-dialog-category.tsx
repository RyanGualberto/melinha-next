import React, { Dispatch, SetStateAction } from "react";
import { IProductVariantCategory } from "@/types/product-variant-category";
import ProductViewDialogVariant from "./product-view-dialog-variant";

export function ProductViewDialogCategory({
  productVariantCategory,
  complements,
  setComplements,
}: {
  productVariantCategory: IProductVariantCategory;
  complements: string[];
  setComplements: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div key={productVariantCategory.id}>
      <h3 className="font-medium mb-3">{productVariantCategory.name}</h3>
      <div className="grid grid-cols-1 gap-2">
        {productVariantCategory.productVariants.map((variant) => (
          <ProductViewDialogVariant
            key={variant.id}
            productVariant={variant}
            complements={complements}
            setComplements={setComplements}
          />
        ))}
      </div>
    </div>
  );
}
