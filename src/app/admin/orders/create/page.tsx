"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs } from "@/components/ui/tabs";
import { createOrder, CreateOrderDto, OrderProductDto } from "@/requests/order";
import { toast } from "sonner";
import { UsersResponse } from "@/requests/user";
import { IAddress } from "@/types/address";
import ResumeTab from "@/components/manual-orders-creation/resume-tab";
import PaymentTab from "@/components/manual-orders-creation/payment-tab";
import ClientAndAddressTab from "@/components/manual-orders-creation/client-and-address-tab";
import ProductsTab from "@/components/manual-orders-creation/products-tab";
import TabsHeader from "@/components/manual-orders-creation/tabs-header";
import { useMutation } from "@tanstack/react-query";

// Schema para validação do formulário
const orderSchema = z.object({
  clienteId: z.string().optional(),
  addressId: z.string().optional(),
  addressSnapshot: z.string().optional(),
  isWithdrawal: z.boolean().default(false),
  paymentMethod: z.enum(["money", "card", "pix"]),
  paymentChange: z.number().optional(),
  discount: z.number().default(0),
  deliveryCost: z.number().default(5),
  orderObservation: z.string().optional(),
});

export type ManualOrderFormValues = z.infer<typeof orderSchema>;

export default function CriarPedidoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("clients");
  const [selectedClient, setSelectedClient] = useState<UsersResponse | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [products, setProducts] = useState<OrderProductDto[]>([]);
  const [manualAddress, setManualAddress] = useState("");

  // Inicializar formulário
  const form = useForm<ManualOrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clienteId: undefined,
      addressId: undefined,
      addressSnapshot: undefined,
      isWithdrawal: false,
      paymentMethod: "money",
      paymentChange: undefined,
      discount: 0,
      deliveryCost: 5,
      orderObservation: "",
    },
  });

  const { mutateAsync: createOrderMutation } = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: async (data: CreateOrderDto) => {
      return await createOrder(data);
    },
  });

  // Observar mudanças no formulário
  const isWithdrawal = form.watch("isWithdrawal");
  const paymentMethod = form.watch("paymentMethod");
  const deliveryCost = form.watch("deliveryCost");
  const discount = form.watch("discount");

  // Atualizar o formulário quando o cliente ou endereço mudar
  useEffect(() => {
    if (selectedClient) {
      form.setValue("clienteId", selectedClient.id);
    } else {
      form.setValue("clienteId", undefined);
    }
  }, [selectedClient, form]);

  useEffect(() => {
    if (selectedAddress) {
      form.setValue("addressId", selectedAddress.id);
      form.setValue("addressSnapshot", undefined);
    } else if (manualAddress) {
      form.setValue("addressId", undefined);
      form.setValue("addressSnapshot", manualAddress);
    } else {
      form.setValue("addressId", undefined);
      form.setValue("addressSnapshot", undefined);
    }
  }, [selectedAddress, manualAddress, form]);

  // Calcular o total do pedido
  const calculateSubTotal = () => {
    return products.reduce(
      (total, produto) => total + produto.price * produto.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubTotal();
    const total = subtotal + (isWithdrawal ? 0 : deliveryCost) - discount;
    return total > 0 ? total : 0;
  };

  // Adicionar produto ao pedido
  const addProduct = (produto: OrderProductDto) => {
    setProducts((prev) => [...prev, produto]);
  };

  // Remover produto do pedido
  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // Atualizar quantidade de um produto
  const updateQuantity = (index: number, quantidade: number) => {
    if (quantidade < 1) return;

    setProducts((prev) =>
      prev.map((produto, i) => {
        if (i === index) {
          return { ...produto, quantity: quantidade };
        }
        return produto;
      })
    );
  };

  // Verificar se pode avançar para a próxima etapa
  const canNext = () => {
    if (activeTab === "clients") {
      if (isWithdrawal) return true;
      return !!selectedClient || !!manualAddress;
    }
    if (activeTab === "products") {
      return products.length > 0;
    }
    return true;
  };

  // Avançar para a próxima etapa
  const nextStep = () => {
    if (activeTab === "clients") setActiveTab("products");
    else if (activeTab === "products") setActiveTab("payment");
    else if (activeTab === "payment") setActiveTab("resume");
  };

  // Voltar para a etapa anterior
  const previousStep = () => {
    if (activeTab === "resume") setActiveTab("payment");
    else if (activeTab === "payment") setActiveTab("products");
    else if (activeTab === "products") setActiveTab("cliente");
  };

  // Enviar o formulário
  const onSubmit = async (data: ManualOrderFormValues) => {
    if (products.length === 0) {
      toast.error("Adicione pelo menos um produto ao pedido");
      return;
    }

    setIsLoading(true);

    try {
      const pedidoData: CreateOrderDto = {
        addressId: data.addressId,
        addressSnapshot: data.addressSnapshot,
        products: products,
        total: calculateTotal(),
        discount: data.discount,
        deliveryCost: isWithdrawal ? 0 : data.deliveryCost,
        paymentMethod: data.paymentMethod,
        paymentChange:
          data.paymentMethod === "money" ? data.paymentChange : undefined,
        orderObservation: data.orderObservation,
        isWithdrawal: data.isWithdrawal,
      };

      // Chamar a API para criar o pedido
      await createOrderMutation(pedidoData);

      toast.success("Pedido #${resultado.id} criado com sucesso");

      // Redirecionar para a página de detalhes do pedido
      router.push(`/admin/orders`);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Ocorreu um erro ao criar o pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Criar Pedido Manual
          </h1>
          <p className="text-muted-foreground">
            Crie um pedido manualmente para clientes que entraram em contato por
            WhatsApp ou telefone
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsHeader activeTab={activeTab} />

            {/* Etapa 1: Cliente e Endereço */}
            <ClientAndAddressTab
              canNext={canNext}
              form={form}
              isWithdrawal={isWithdrawal}
              manualAddress={manualAddress}
              nextStep={nextStep}
              selectedAddress={selectedAddress}
              selectedClient={selectedClient}
              setManualAddress={setManualAddress}
              setSelectedAddress={setSelectedAddress}
              setSelectedClient={setSelectedClient}
            />
            {/* Etapa 2: Produtos */}
            <ProductsTab
              addProduct={addProduct}
              calculateSubTotal={calculateSubTotal}
              canNext={canNext}
              nextStep={nextStep}
              previousStep={previousStep}
              products={products}
              removeProduct={removeProduct}
              updateQuantity={updateQuantity}
            />
            {/* Etapa 3: Pagamento */}
            <PaymentTab
              isWithdrawal={isWithdrawal}
              calculateSubTotal={calculateSubTotal}
              calculateTotal={calculateTotal}
              deliveryCost={deliveryCost}
              discount={discount}
              form={form}
              paymentMethod={paymentMethod}
              previousStep={previousStep}
              nextStep={nextStep}
            />
            {/* Etapa 4: Resumo */}
            <ResumeTab
              isLoading={isLoading}
              isWithdrawal={isWithdrawal}
              manualAddress={manualAddress}
              selectedAddress={selectedAddress}
              selectedClient={selectedClient}
              calculateSubTotal={calculateSubTotal}
              calculateTotal={calculateTotal}
              deliveryCost={deliveryCost}
              discount={discount}
              form={form}
              paymentMethod={paymentMethod}
              previousStep={previousStep}
              products={products}
            />
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
