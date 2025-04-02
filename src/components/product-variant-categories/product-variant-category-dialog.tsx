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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ProductVariantCategoryFormValues,
  productVariantCategorySchema,
} from "@/schemas/product-variant-category-schema";
import { IProductVariantCategory } from "@/types/product-variant-category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ProductVariantCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productVariantCategory?: IProductVariantCategory;
  onSave: (data: ProductVariantCategoryFormValues) => Promise<void>;
}

export function ProductVariantCategoryDialog({
  open,
  onOpenChange,
  productVariantCategory,
  onSave,
}: ProductVariantCategoryDialogProps) {
  const form = useForm<ProductVariantCategoryFormValues>({
    resolver: zodResolver(productVariantCategorySchema),
    defaultValues: {
      name: "",
      max: 0,
      type: "MULTIPLE",
    },
  });

  const { reset, formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (productVariantCategory) {
      reset({
        ...productVariantCategory,
        max: productVariantCategory.max ?? 0,
      });
    } else {
      reset({
        name: "",
        max: 0,
        type: "MULTIPLE",
      });
    }
  }, [productVariantCategory, reset]);

  const onSubmit = async (data: ProductVariantCategoryFormValues) => {
    await onSave(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {productVariantCategory
              ? "Editar Categoria de Variante"
              : "Adicionar Categoria de Variante"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para{" "}
            {productVariantCategory ? "editar a" : "adicionar uma nova"}{" "}
            categoria de variante.
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
                    <Input
                      placeholder="Nome da categoria de variante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tipo de variante" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MULTIPLE">Múltiplo</SelectItem>
                          <SelectItem value="SINGLE">Único</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("type") === "MULTIPLE" && (
                <FormField
                  control={form.control}
                  name="max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máximo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Máximo de opções"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
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
