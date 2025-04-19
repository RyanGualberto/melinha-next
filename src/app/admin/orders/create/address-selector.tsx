"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IAddress } from "@/types/address";
import { useQuery } from "@tanstack/react-query";
import { listAddressesByUserId } from "@/requests/address";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import { ManualAddressForm } from "@/components/manual-orders-creation/client-and-address-tab";

interface AddressSelectorProps {
  clientId: string;
  selectedAddress: IAddress | null;
  setSelectedAdddress: (address: IAddress | null) => void;
  manualAddress: string;
  setManualAddress: (address: string) => void;
}

export function AddressSelector({
  clientId,
  selectedAddress,
  setSelectedAdddress,
  setManualAddress,
}: AddressSelectorProps) {
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["client", clientId, "address"],
    queryFn: async () => await listAddressesByUserId(clientId),
  });
  const [activeTab, setActiveTab] = useState<string>("saveds");

  const manualForm = useForm<ManualAddressForm>({
    defaultValues: {
      address: "",
      number: "",
      complement: "",
      reference: "",
      district: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  const watchedFields = useWatch({ control: manualForm.control });

  useEffect(() => {
    setManualAddress(JSON.stringify(watchedFields));
  }, [watchedFields, setManualAddress]);
  useEffect(() => {
    if (activeTab === "saveds") {
      setManualAddress("");
    } else {
      setSelectedAdddress(null);
    }
  }, [activeTab, setManualAddress, setSelectedAdddress]);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saveds">Endereços Cadastrados</TabsTrigger>
          <TabsTrigger value="manual">Endereço Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="saveds" className="space-y-4">
          {isLoading ? (
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">
                Carregando endereços...
              </p>
            </div>
          ) : addresses?.length === 0 ? (
            <div className="text-center p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">
                Nenhum endereço cadastrado para este cliente
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                type="button"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Endereço
              </Button>
            </div>
          ) : (
            <RadioGroup
              value={selectedAddress?.id}
              onValueChange={(value) => {
                const address = addresses?.find((e) => e.id === value);
                setSelectedAdddress(address || null);
              }}
            >
              {addresses?.map((address) => (
                <div
                  key={address.id}
                  className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer"
                  onClick={() => setSelectedAdddress(address)}
                >
                  <RadioGroupItem
                    value={address.id}
                    id={`address-${address.id}`}
                  />
                  <Label
                    htmlFor={`address-${address.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{address.name}</div>
                    <div className="text-sm">
                      {address.address}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </div>
                    <div className="text-sm">
                      {address.district}, {address.city} - {address.state}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Insira o endereço de entrega manualmente:
            </p>
            {(
              [
                ["address", "Endereço"],
                ["number", "Número"],
                ["complement", "Complemento"],
                ["reference", "Referência"],
                ["district", "Bairro"],
                ["city", "Cidade"],
                ["state", "Estado"],
                ["country", "País"],
                ["zipCode", "CEP"],
              ] as [keyof ManualAddressForm, string][]
            ).map(([name, label]) => (
              <FormField
                key={name}
                control={manualForm.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
