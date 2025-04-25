import React, { Dispatch, SetStateAction } from "react";
import { IProductVariantCategory } from "@/types/product-variant-category";
import ProductViewDialogVariant from "./product-view-dialog-variant";

export interface Complement {
  categoryId: string;
  variantId: string;
  productId: string;
}

export function ProductViewDialogCategory({
  productVariantCategory,
  complements,
  setComplements,
}: {
  productVariantCategory: IProductVariantCategory;
  complements: Complement[];
  setComplements: Dispatch<SetStateAction<Complement[]>>;
}) {
  const complementsFromSameProduct = (variant: Complement) =>
    complements.filter(
      (complement) => complement.productId === variant.productId
    );

  const complementsFromSameCategory = (variant: Complement) =>
    complementsFromSameProduct(variant).filter(
      (complement) => complement.categoryId === productVariantCategory.id
    );

  const isDisabled = (complement: Complement) => {
    if (
      complementsFromSameCategory(complement).length >=
      (productVariantCategory.max || 999)
    ) {
      return true;
    }

    return false;
  };

  return (
    <div key={productVariantCategory.id}>
      <div className="flex gap-1 items-end mb-3">
        <h3 className="font-medium">{productVariantCategory.name}</h3>
        <h5 className="text-xs opacity-50 mb-[3px]">
          (
          {productVariantCategory.type === "MULTIPLE"
            ? productVariantCategory.max
              ? "Escolha até " + productVariantCategory.max
              : "Escolha quantos quiser"
            : "Escolha uma opção"}
          )
        </h5>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {productVariantCategory.productVariants.map((variant) => (
          <ProductViewDialogVariant
            key={variant.id}
            productVariant={variant}
            complements={complements}
            setComplements={setComplements}
            disabled={isDisabled}
            type={productVariantCategory.type}
          />
        ))}
      </div>
    </div>
  );
}
