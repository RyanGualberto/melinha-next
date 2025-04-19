import React from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ProductSelector } from "@/app/admin/orders/create/product-selector";
import { Separator } from "../ui/separator";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { OrderProductDto } from "@/requests/order";

export default function ProductsTab({
  addProduct,
  removeProduct,
  updateQuantity,
  canNext,
  nextStep,
  previousStep,
  calculateSubTotal,
  products,
}: {
  addProduct: (produto: OrderProductDto) => void;
  removeProduct: (index: number) => void;
  updateQuantity: (index: number, quantidade: number) => void;
  previousStep: () => void;
  nextStep: () => void;
  canNext: () => boolean;
  calculateSubTotal: () => number;
  products: OrderProductDto[];
}) {
  return (
    <TabsContent value="products" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
          <CardDescription>Adicione os produtos ao pedido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProductSelector onAddProducts={addProduct} />

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Produtos no Pedido</h3>

            {products.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Nenhum produto adicionado ao pedido
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{product.productId}</h4>
                        <p className="font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.price * product.quantity)}
                        </p>
                      </div>

                      {product.variants.length > 0 && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>
                            Variantes:{" "}
                            {product.variants
                              .map(
                                (v) =>
                                  `${v.variantName} (+${new Intl.NumberFormat(
                                    "pt-BR",
                                    {
                                      style: "currency",
                                      currency: "BRL",
                                    }
                                  ).format(v.variantPrice)})`
                              )
                              .join(", ")}
                          </p>
                        </div>
                      )}

                      {product.productObservation && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>Obs: {product.productObservation}</p>
                        </div>
                      )}

                      <div className="mt-2 flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(index, product.quantity - 1)
                          }
                          disabled={product.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">
                          {product.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(index, product.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeProduct(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-between rounded-md bg-muted p-4">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(calculateSubTotal())}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={previousStep}>
            Voltar
          </Button>
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canNext()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Próximo: Pagamento
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
