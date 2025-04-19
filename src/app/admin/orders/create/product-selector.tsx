"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { useQuery } from "@tanstack/react-query";
import { listMenu } from "@/requests/menu";
import { IProduct } from "@/types/product";
import { OrderProductDto, OrderProductVariantDto } from "@/requests/order";

interface ProductSelectorProps {
  onAddProducts: (product: OrderProductDto) => void;
}

export function ProductSelector({ onAddProducts }: ProductSelectorProps) {
  const [search, setSearch] = useState("");
  const { data: menu, isLoading } = useQuery({
    queryKey: ["admin", "menu"],
    queryFn: async () => listMenu(search),
  });

  const [products, variants] = useMemo(() => {
    if (!menu) return [[], []];

    const allProducts = menu.categories.flatMap((category) =>
      category.products.map((p) => ({
        ...p,
        category,
      }))
    );
    const allVariants = allProducts.flatMap(
      (product) => product.productVariants
    );

    return [allProducts, allVariants];
  }, [menu]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  // Abrir o diálogo de detalhes do product
  const openDetails = (product: IProduct) => {
    setSelectedProduct(product);
    setQuantity(1);
    setObservation("");
    setSelectedVariants([]);
    setDialogOpen(true);
  };

  // Alternar seleção de variante
  const toggleVariant = (variantId: string) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  // Adicionar product ao pedido
  const adicionarAoPedido = () => {
    if (!selectedProduct) return;

    // Mapear variantes selecionadas
    const mappedSelectedVariants: OrderProductVariantDto[] =
      selectedVariants.map((variantId) => {
        const variante = variants.find((v) => v.id === variantId);
        return {
          variantName: variante?.name || "",
          variantPrice: variante?.price || 0,
        };
      });

    // Calcular preço total (product + variantes)
    const precoBase = selectedProduct.price;
    const precoVariantes = mappedSelectedVariants.reduce(
      (total, variante) => total + variante.variantPrice,
      0
    );
    const precoTotal = precoBase + precoVariantes;

    // Criar objeto do product para o pedido
    const orderProduct: OrderProductDto = {
      productId: selectedProduct.id, // Usando title como ID para exemplo
      quantity: quantity,
      price: precoTotal,
      variants: mappedSelectedVariants,
      productObservation: observation || undefined,
    };

    // Adicionar ao pedido
    onAddProducts(orderProduct);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar produto por nome..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">Buscando produtos...</p>
        </div>
      ) : search.length >= 2 && products.length === 0 ? (
        <div className="text-center p-4 border rounded-md">
          <p className="text-sm text-muted-foreground">
            Nenhum produto encontrado
          </p>
        </div>
      ) : products.length > 0 ? (
        <ScrollArea className="h-72 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Resultados da busca
            </h4>
            {products.map((product) => (
              <div
                key={product.id}
                className="mb-2 cursor-pointer rounded-md border p-3 hover:bg-muted"
                onClick={() => openDetails(product)}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{product.title}</div>
                  <div className="font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.description}
                </div>
                <Badge variant="outline" className="mt-2">
                  {product.category.name}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Busque por um protudo para adicionar ao pedido
          </p>
        </div>
      )}

      {/* Diálogo de detalhes do product */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              {selectedProduct?.description}
            </div>

            <div className="flex items-center justify-between">
              <div className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedProduct?.price || 0)}
              </div>

              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Variantes</h4>
              <div className="space-y-2">
                {variants
                  .filter((v) => v.productId === selectedProduct?.id)
                  .map((variante) => (
                    <div
                      key={variante.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`variante-${variante.id}`}
                        checked={selectedVariants.includes(variante.id)}
                        onCheckedChange={() => toggleVariant(variante.id)}
                      />
                      <Label
                        htmlFor={`variante-${variante.id}`}
                        className="flex-1"
                      >
                        {variante.name}
                        {variante.price > 0 && (
                          <span className="ml-1 text-muted-foreground">
                            (+
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(variante.price)}
                            )
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observações</Label>
              <Textarea
                id="observation"
                placeholder="Alguma observação para este product? (opcional)"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={3}
              />
            </div>

            <div className="rounded-md bg-muted p-3">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    (selectedProduct?.price || 0) * quantity +
                      selectedVariants.reduce((total, variantId) => {
                        const variante = variants.find(
                          (v) => v.id === variantId
                        );
                        return total + (variante?.price || 0);
                      }, 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={adicionarAoPedido}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Adicionar ao Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
