"use client";

// Tipos
import type { OrderProductDto } from "@/requests/order";

interface CartResumeProps {
  products: OrderProductDto[];
}

export function CartResume({ products }: CartResumeProps) {
  if (products.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-sm text-muted-foreground">
          Nenhum produto adicionado ao pedido
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Produto</th>
              <th className="text-center p-3">Qtd</th>
              <th className="text-right p-3">Preço</th>
              <th className="text-right p-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((produto, index) => (
              <tr key={index}>
                <td className="p-3">
                  <div className="font-medium">{produto.productId}</div>
                  {produto.variants.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {produto.variants.map((variante) => (
                        <div key={variante.variantName}>
                          {variante.variantName}{" "}
                          {variante.variantPrice > 0 && (
                            <span>
                              (+
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(variante.variantPrice)}
                              )
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {produto.productObservation && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      Obs: {produto.productObservation}
                    </div>
                  )}
                </td>
                <td className="p-3 text-center">{produto.quantity}</td>
                <td className="p-3 text-right">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(produto.price)}
                </td>
                <td className="p-3 text-right">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(produto.price * produto.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted">
            <tr>
              <td colSpan={3} className="p-3 text-right font-medium">
                Subtotal:
              </td>
              <td className="p-3 text-right font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  products.reduce(
                    (total, produto) =>
                      total + produto.price * produto.quantity,
                    0
                  )
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
