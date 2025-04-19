import React from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { CreditCard, FileText, ShoppingBag, User } from "lucide-react";

export default function TabsHeader({ activeTab }: { activeTab: string }) {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger
        value="clients"
        disabled={activeTab !== "cliente" && activeTab !== "products"}
      >
        <User className="mr-2 h-4 w-4" />
        Cliente
      </TabsTrigger>
      <TabsTrigger
        value="products"
        disabled={
          activeTab !== "products" &&
          activeTab !== "cliente" &&
          activeTab !== "payment"
        }
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Produtos
      </TabsTrigger>
      <TabsTrigger
        value="payment"
        disabled={
          activeTab !== "payment" &&
          activeTab !== "products" &&
          activeTab !== "resume"
        }
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Pagamento
      </TabsTrigger>
      <TabsTrigger
        value="resume"
        disabled={activeTab !== "resume" && activeTab !== "payment"}
      >
        <FileText className="mr-2 h-4 w-4" />
        Resumo
      </TabsTrigger>
    </TabsList>
  );
}
