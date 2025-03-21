export const OrderStatus = {
  PENDING: "PENDING", // Pedido recebido, mas não processado
  IN_PROGRESS: "IN_PROGRESS", // Pedido em preparação
  DELIVERY_IN_PROGRESS: "DELIVERY_IN_PROGRESS", // Pedido a caminho
  COMPLETED: "COMPLETED", // Pedido finalizado e entregue
  CANCELED: "CANCELED", // Pedido cancelado
};
