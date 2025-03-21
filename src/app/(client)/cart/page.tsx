"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
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

export default function CarrinhoPage() {
  const router = useRouter();
  const {
    cart,
    handleRemoveCartItem,
    handleChangeQuantity,
    setAddress,
    setPaymentMethod,
    setPaymentChange,
    setObservation,
  } = useCartContext();
  const { addresses } = useAuthContext();
  const [selectedAddress, setSelectedAddress] = useState("");

  const calculateTotalAndSubtotal = useMemo(() => {
    const subtotal = cart.products.reduce((acc, item) => acc + item.price, 0);
    const total = subtotal - (cart.discount || 0) + cart.deliveryCost;
    return { subtotal, total };
  }, [cart]);

  useEffect(() => {
    if (selectedAddress) {
      setAddress(
        addresses.find((address) => address.id === selectedAddress) as IAddress
      );
    }
  }, [selectedAddress, addresses]);

  const handleFinalizarPedido = () => {
    console.log("Finalizando pedido", {
      cart,
      total: calculateTotalAndSubtotal.total,
    });

    router.push("/profile/orders");
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
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cart.products.map((product) => (
                    <div key={product.id} className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
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
              <CardContent className="space-y-4">
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
                          {address.name} - {address.address}, {address.district}
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
                    <RadioGroupItem value="dinheiro" id="dinheiro" />
                    <Label htmlFor="dinheiro" className="flex-1 cursor-pointer">
                      Dinheiro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <Label htmlFor="cartao" className="flex-1 cursor-pointer">
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

                {cart.paymentMethod === "dinheiro" && (
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
                        onChange={(e) =>
                          // a cada 2 do lado direito acrecenta uma virgula
                          // a forma atual não me deixa acrescentar 0, exemplo 20, 200, 2000
                          setPaymentChange(e.target.value)
                        }
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
              <CardFooter>
                <Button
                  className="w-full bg-[#73067D] hover:bg-[#73067D]/80"
                  size="lg"
                  onClick={handleFinalizarPedido}
                  disabled={
                    !selectedAddress ||
                    (cart.paymentMethod === "dinheiro" && !cart.paymentChange)
                  }
                >
                  Finalizar Pedido
                </Button>
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
