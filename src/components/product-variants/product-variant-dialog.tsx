"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProductVariant } from "@/types/product-variant";
import {
  ProductVariantFormValues,
  productVariantSchema,
} from "@/schemas/product-variant-schema";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/requests/product";
import { listProductVariantCategories } from "@/requests/product-variant-category";

interface ProductVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productVariant?: IProductVariant;
  onSave: (data: ProductVariantFormValues) => Promise<void>;
}

export function ProductVariantDialog({
  open,
  onOpenChange,
  productVariant,
  onSave,
}: ProductVariantDialogProps) {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await listProducts(),
  });
  const { data: productVariantCategories } = useQuery({
    queryKey: ["product-variant-categories"],
    queryFn: async () => await listProductVariantCategories(),
  });
  const form = useForm<ProductVariantFormValues>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      name: "",
      price: 0,
      status: "ACTIVE",
      productId: "",
      image:
        "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    },
  });

  const { reset, formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (productVariant) {
      reset(productVariant);
    } else {
      reset({
        name: "",
        price: 0,
        status: "ACTIVE",
        productId: "",
        image:
          "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
      });
    }
  }, [productVariant, reset]);

  const onSubmit = async (data: ProductVariantFormValues) => {
    await onSave(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {productVariant ? "Editar variante" : "Adicionar variante"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para{" "}
            {productVariant ? "editar a" : "adicionar uma nova"} variante.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da variante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Adicional</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Valor adicional ao preço do produto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="min-w-24">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(products || []).map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productVariantCategoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Categoria da variante</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a categoria de variante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(productVariantCategories || []).map((pvc) => (
                          <SelectItem key={pvc.id} value={pvc.id}>
                            {pvc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="URL da imagem" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira a URL da imagem da variante
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
