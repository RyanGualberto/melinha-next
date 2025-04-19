import React, { Dispatch, SetStateAction, useEffect } from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ClientsSelector } from "@/app/admin/orders/create/client-selector";
import { Separator } from "../ui/separator";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { AddressSelector } from "@/app/admin/orders/create/address-selector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { UsersResponse } from "@/requests/user";
import { IAddress } from "@/types/address";
import { UseFormReturn, useForm, useWatch } from "react-hook-form";
import { ManualOrderFormValues } from "@/app/admin/orders/create/page";

export interface ManualAddressForm {
  address: string;
  number: string;
  complement: string;
  reference: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export default function ClientAndAddressTab({
  selectedClient,
  setSelectedClient,
  form,
  isWithdrawal,
  selectedAddress,
  setSelectedAddress,
  manualAddress,
  setManualAddress,
  nextStep,
  canNext,
}: {
  selectedClient: UsersResponse | null;
  setSelectedClient: Dispatch<SetStateAction<UsersResponse | null>>;
  form: UseFormReturn<ManualOrderFormValues, unknown, undefined>;
  isWithdrawal: boolean;
  selectedAddress: IAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<IAddress | null>>;
  manualAddress: string;
  setManualAddress: Dispatch<SetStateAction<string>>;
  nextStep: () => void;
  canNext: () => boolean;
}) {
  const router = useRouter();

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

  return (
    <TabsContent value="clients" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>
            Selecione um cliente existente ou crie um pedido sem vínculo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ClientsSelector
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
          />
          <Separator />
          <FormField
            control={form.control}
            name="isWithdrawal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Retirada no Local</FormLabel>
                  <FormDescription>
                    O cliente irá retirar o pedido na loja (não será necessário
                    endereço de entrega)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!isWithdrawal && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço de Entrega</h3>

              {selectedClient ? (
                <AddressSelector
                  clientId={selectedClient.id}
                  selectedAddress={selectedAddress}
                  setSelectedAdddress={setSelectedAddress}
                  manualAddress={manualAddress}
                  setManualAddress={setManualAddress}
                />
              ) : (
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
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canNext()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Próximo: Produtos
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
