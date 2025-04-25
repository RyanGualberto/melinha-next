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
import { CouponFormValues, couponSchema } from "@/schemas/coupon-schema";
import { ICoupon } from "@/types/coupon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: ICoupon;
  onSave: (data: CouponFormValues) => Promise<void>;
}

export function CouponDialog({
  open,
  onOpenChange,
  coupon,
  onSave,
}: CouponDialogProps) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discount: 0,
      active: false,
      expiresAt: new Date(),
      maxUses: undefined,
      type: "VALUE",
    },
  });

  const { reset, formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (coupon) {
      reset({
        ...coupon,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt) : new Date(),
      });
    } else {
      reset({
        code: "",
        description: "",
        discount: 0,
        active: false,
        expiresAt: new Date(),
        maxUses: undefined,
        type: "VALUE",
      });
    }
  }, [coupon, reset]);

  const onSubmit = async (data: CouponFormValues) => {
    await onSave(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {coupon ? "Editar Cupom" : "Adicionar Cupom"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para{" "}
            {coupon ? "editar o" : "adicionar um novo"} cupom.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Código do cupom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do cupom" {...field} />
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
                    <FormLabel>Tipo de desconto</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tipo de desconto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENT">Porcentagem</SelectItem>
                          <SelectItem value="VALUE">Valor</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Desconto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Desconto"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Máximo de usos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Máximo de usos"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Data de expiração</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Data de expiração"
                        type="date"
                        value={field.value?.toISOString().split("T")[0]}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="active"
                      aria-label="Ativo"
                    />
                  </FormControl>
                  <FormLabel>Ativo</FormLabel>
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
