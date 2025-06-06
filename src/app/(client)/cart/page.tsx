"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/user-context";
import { useCartContext } from "@/contexts/cart-context";
import { IAddress } from "@/types/address";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createOrder, CreateOrderDto } from "@/requests/order";
import { getSettings } from "@/requests/settings";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getCoupon } from "@/requests/coupon";

export default function CarrinhoPage() {
  const router = useRouter();
  const [needPaymentChange, setNeedPaymentChange] = useState(false);
  const { data: storeConfig } = useQuery({
    queryKey: ["store-config"],
    queryFn: async () => await getSettings(),
  });
  const {
    cleanCart,
    cart,
    handleRemoveCartItem,
    handleChangeQuantity,
    setAddress,
    setPaymentMethod,
    setPaymentChange,
    setObservation,
    toggleIsWithdrawal,
    calculateTotalAndSubtotal,
    addDiscount,
  } = useCartContext();
  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } =
    useMutation({
      mutationKey: ["createOrder"],
      mutationFn: async (data: CreateOrderDto) => {
        return await createOrder(data);
      },
    });
  const [usingCoupon, setUsingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const { data: coupon, refetch: refetchCoupon } = useQuery({
    queryKey: ["coupon"],
    queryFn: async () => {
      if (!couponCode) return null;
      const coupon = await getCoupon(couponCode);
      addDiscount(coupon);
      return coupon;
    },
  });

  const { addresses } = useAuthContext();
  const [selectedAddress, setSelectedAddress] = useState("");

  const disabledButton = useMemo(() => {
    return (
      isCreatingOrder ||
      (!cart.isWithdrawal && !selectedAddress) ||
      (cart.paymentMethod === "money" &&
        needPaymentChange &&
        !cart.paymentChange) ||
      !cart.paymentMethod ||
      (storeConfig?.orderMinimum ?? 0) > calculateTotalAndSubtotal.total ||
      !storeConfig?.opened
    );
  }, [
    isCreatingOrder,
    cart,
    selectedAddress,
    needPaymentChange,
    calculateTotalAndSubtotal,
    storeConfig?.orderMinimum,
    storeConfig?.opened,
  ]);

  useEffect(() => {
    if (selectedAddress) {
      setAddress(
        addresses.find((address) => address.id === selectedAddress) as IAddress
      );
    }
  }, [selectedAddress, addresses]);

  const handleFinalizarPedido = async () => {
    await createOrderMutation({
      addressId: selectedAddress,
      products: cart.products.map((product) => ({
        productObservation: product.observation,
        productId: product.product.id,
        quantity: product.quantity,
        price: product.price,
        variants: product.variants.map((variant) => ({
          variantName: variant.variantName,
          variantPrice: variant.variantPrice,
        })),
      })),
      total: calculateTotalAndSubtotal.total,
      discount: cart.discount || 0,
      deliveryCost: cart.deliveryCost,
      paymentMethod: cart.paymentMethod,
      paymentChange: cart.paymentChange
        ? Number(cart.paymentChange)
        : undefined,
      addressSnapshot: JSON.stringify(
        addresses.find((address) => address.id === selectedAddress)
      ),
      orderObservation: cart.observation,
      isWithdrawal: cart.isWithdrawal,
      couponId: cart?.couponId,
    });
    router.push("/profile/orders");
    cleanCart();
  };

  useEffect(() => {
    if (
      addresses &&
      addresses.length > 0 &&
      addresses.find((address) => address.principal)
    ) {
      setSelectedAddress(
        addresses.find((address) => address.principal)?.id || ""
      );
    }
  }, [addresses]);

  if (!storeConfig) return null;

  return (
    <div className="container py-8 px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Carrinho</h1>
        <p className="text-muted-foreground">
          Revise seu pedido e escolha as opções de entrega
        </p>
      </div>

      {cart.products.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6 max-w-screen overflow-x-hidden">
            <Card className="max-w-full">
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="p-0 w-full">
                <div className="divide-y w-full">
                  {cart.products.map((product) => (
                    <div key={product.id} className="p-2 sm:p-6">
                      <div className="flex gap-2 md:gap-4">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={product.product.image || "/placeholder.svg"}
                            alt={product.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-medium">
                              {product.product.title}
                            </h3>
                            <p className="font-medium">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(product.price)}
                            </p>
                          </div>

                          <div className="mt-1 text-sm text-muted-foreground">
                            {product.variants.map((variant, index) => (
                              <div key={index}>
                                {variant.variantName}:
                                {`${new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(variant.variantPrice)}`}
                              </div>
                            ))}
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center border rounded-md">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleChangeQuantity(
                                    product,
                                    product.quantity - 1
                                  )
                                }
                                disabled={product.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {product.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleChangeQuantity(
                                    product,
                                    product.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => handleRemoveCartItem(product)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline" asChild>
                  <Link href="/">Continuar Comprando</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col gap-4">
                <RadioGroup
                  value={String(cart.isWithdrawal)}
                  defaultValue="false"
                  onValueChange={(value) =>
                    toggleIsWithdrawal(value === "true")
                  }
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="flex-1 cursor-pointer">
                      Retirada
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="flex-1 cursor-pointer">
                      Delivery
                    </Label>
                  </div>
                </RadioGroup>
                {cart.isWithdrawal ? (
                  <span className="text-sm ">
                    Você escolheu retirar seu pedido na loja. Aguarde o
                    estabelecimento entrar em contato com você.
                  </span>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Selecione um endereço</Label>
                      <Select
                        value={selectedAddress}
                        onValueChange={setSelectedAddress}
                      >
                        <SelectTrigger id="endereco">
                          <SelectValue placeholder="Selecione um endereço" />
                        </SelectTrigger>
                        <SelectContent>
                          {addresses.map((address) => (
                            <SelectItem key={address.id} value={address.id}>
                              {address.name} - {address.address},{" "}
                              {address.district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-sm">
                      {selectedAddress && (
                        <div className="rounded-md border p-3">
                          {(() => {
                            const endereco = addresses.find(
                              (e) => e.id === selectedAddress
                            );
                            return endereco ? (
                              <>
                                <p className="font-medium">{endereco.name}</p>
                                <p>
                                  {endereco.address}, {endereco.number}
                                </p>
                                <p>
                                  {endereco.complement}, {endereco.reference}
                                </p>
                                <p>
                                  {endereco.district}, {endereco.city} -{" "}
                                  {endereco.state}
                                </p>
                                <p>CEP: {endereco.zipCode}</p>
                              </>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Não encontrou seu endereço?
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/profile/addresses">Adicionar Novo</Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={cart.paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="money" id="money" />
                    <Label htmlFor="money" className="flex-1 cursor-pointer">
                      Dinheiro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      Cartão (na entrega)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex-1 cursor-pointer">
                      PIX
                    </Label>
                  </div>
                </RadioGroup>
                {cart.paymentMethod === "money" && (
                  // adiciona a opção para perguntar se precisa de troco
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="troco"
                      checked={needPaymentChange}
                      onCheckedChange={(checked) => {
                        setNeedPaymentChange(Boolean(checked));
                      }}
                    />
                    <Label htmlFor="troco">Precisa de troco?</Label>
                  </div>
                )}

                {cart.paymentMethod === "money" && needPaymentChange && (
                  <div className="space-y-2">
                    <Label htmlFor="troco">Troco para</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        R$
                      </span>
                      <Input
                        id="troco"
                        type="text"
                        value={String(cart.paymentChange)}
                        onChange={(e) => setPaymentChange(e.target.value)}
                        className="pl-9"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                )}

                {cart.paymentMethod === "pix" && (
                  <div className="rounded-md border p-3 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Você receberá as informações para pagamento após finalizar
                      o pedido.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Alguma observação para o seu pedido? (opcional)"
                  value={cart.observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(calculateTotalAndSubtotal.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(cart.deliveryCost)}
                  </span>
                </div>
                <Separator />
                <div
                  className={cn(
                    "flex justify-between font-medium items-center",
                    {
                      "justify-between": usingCoupon,
                      "justify-end": !usingCoupon,
                    }
                  )}
                >
                  {usingCoupon ? <span>Cupom</span> : null}
                  {usingCoupon ? (
                    <>
                      <Input
                        type="text"
                        placeholder="Digite seu cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full"
                        onFocus={() => setUsingCoupon(true)}
                      />
                      <Button
                        size="icon"
                        onClick={() => {
                          refetchCoupon();
                          setUsingCoupon(false);
                          setCouponCode("");
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#73067D] hover:bg-[#73067D]/10"
                      onClick={() => setUsingCoupon(true)}
                    >
                      <PlusCircle /> Adicionar Cupom
                    </Button>
                  )}
                </div>
                <div className="flex justify-between font-medium">
                  <span>Desconto</span>
                  <div className="flex flex-col gap-0.5">
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(cart.discount || 0)}
                    </span>
                    {cart.couponCode ||
                      (coupon?.code && (
                        <span className="text-sm text-muted-foreground">
                          {cart.couponCode || coupon.code}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(calculateTotalAndSubtotal.total)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex-col">
                <Button
                  className="w-full bg-[#73067D] hover:bg-[#73067D]/80"
                  size="lg"
                  onClick={handleFinalizarPedido}
                  disabled={disabledButton}
                >
                  Finalizar Pedido
                </Button>
                {!storeConfig?.opened && (
                  <p className="bg-red-50 border border-red-700 text-sm text-center text-red-700 mt-2 w-full p-2 rounded-md">
                    Estamos fechados no momento, volte mais tarde.
                  </p>
                )}
                {storeConfig?.orderMinimum >
                  calculateTotalAndSubtotal.total && (
                  <p className="bg-yellow-50 border border-yellow-600 font-semibold text-sm text-center text-yellow-800 mt-2 w-full p-2 rounded-md">
                    Pedido mínimo de{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(storeConfig?.orderMinimum)}
                  </p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-muted-foreground mb-6">
            Adicione alguns produtos deliciosos para começar seu pedido.
          </p>
          <Button asChild className="bg-[#73067D] hover:bg-[#73067D]/80">
            <Link href="/">Ver Cardápio</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
