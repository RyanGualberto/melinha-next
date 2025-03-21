import { Pedido } from "@/app/admin/orders/columns";

export const orders: Pedido[] = [
  {
    id: "1",
    cliente: {
      nome: "João Silva",
      telefone: "(11) 98765-4321",
      email: "joao.silva@exemplo.com",
    },
    data: new Date(),
    valor: 42.5,
    status: "entregue",
    endereco: {
      rua: "Rua das Flores, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
    },
    pagamento: {
      metodo: "cartao",
      troco: null,
    },
    items: [
      { id: "1", nome: "Açaí Tradicional (M)", quantidade: 1, preco: 19.99 },
      { id: "2", nome: "Açaí com Banana (P)", quantidade: 1, preco: 17.5 },
    ],
    observacoes: "Entregar na portaria",
    createdAt: new Date(),
  },
  {
    id: "2",
    cliente: {
      nome: "Maria Oliveira",
      telefone: "(11) 91234-5678",
      email: "maria.oliveira@exemplo.com",
    },
    data: new Date(),
    valor: 24.99,
    status: "entregue",
    endereco: {
      rua: "Av. Paulista, 1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
    },
    pagamento: {
      metodo: "dinheiro",
      troco: "50.00",
    },
    items: [{ id: "3", nome: "Açaí Premium (G)", quantidade: 1, preco: 24.99 }],
    observacoes: "",
    createdAt: new Date(),
  },
  {
    id: "3",
    cliente: {
      nome: "Pedro Santos",
      telefone: "(11) 97777-8888",
      email: "pedro.santos@exemplo.com",
    },
    data: new Date(),
    valor: 38.9,
    status: "em_preparo",
    endereco: {
      rua: "Rua Augusta, 500",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
    },
    pagamento: {
      metodo: "pix",
      troco: null,
    },
    items: [
      { id: "4", nome: "Açaí com Morango (M)", quantidade: 2, preco: 19.45 },
    ],
    observacoes: "Sem granola",
    createdAt: new Date(),
  },
  {
    id: "4",
    cliente: {
      nome: "Ana Souza",
      telefone: "(11) 95555-6666",
      email: "ana.souza@exemplo.com",
    },
    data: new Date(),
    valor: 32.4,
    status: "em_preparo",
    endereco: {
      rua: "Rua Oscar Freire, 300",
      bairro: "Jardins",
      cidade: "São Paulo",
      estado: "SP",
    },
    pagamento: {
      metodo: "cartao",
      troco: null,
    },
    items: [
      { id: "5", nome: "Açaí Premium (M)", quantidade: 1, preco: 22.5 },
      { id: "6", nome: "Açaí com Banana (P)", quantidade: 1, preco: 9.9 },
    ],
    observacoes: "",
    createdAt: new Date(),
  },
  {
    id: "5",
    cliente: {
      nome: "Carlos Ferreira",
      telefone: "(11) 93333-4444",
      email: "carlos.ferreira@exemplo.com",
    },
    data: new Date(),
    valor: 45.8,
    status: "aguardando",
    endereco: {
      rua: "Av. Rebouças, 1200",
      bairro: "Pinheiros",
      cidade: "São Paulo",
      estado: "SP",
    },
    pagamento: {
      metodo: "dinheiro",
      troco: "100.00",
    },
    items: [
      { id: "7", nome: "Açaí Especial (G)", quantidade: 1, preco: 26.9 },
      { id: "8", nome: "Açaí com Morango (M)", quantidade: 1, preco: 18.9 },
    ],
    observacoes: "Entregar no apartamento 101",
    createdAt: new Date(),
  },
  {
    id: "6",
    cliente: {
      nome: "Fernanda Lima",
      telefone: "(11) 92222-3333",
      email: "fernanda.lima@exemplo.com",
    },
    data: new Date(),
    valor: 38.9,
    status: "em_entrega",
    endereco: {
      rua: "Rua Teodoro Sampaio, 800",
      bairro: "Pinheiros",
      cidade: "São Paulo",
      estado: "SP",
    },
    pagamento: {
      metodo: "pix",
      troco: null,
    },
    items: [
      { id: "9", nome: "Açaí Tradicional (G)", quantidade: 1, preco: 22.9 },
      { id: "10", nome: "Açaí com Banana (M)", quantidade: 1, preco: 16.0 },
    ],
    observacoes: "",
    createdAt: new Date(),
  },
  {
    id: "7",
    cliente: {
      nome: "Roberto Alves",
      telefone: "(11) 91111-2222",
      email: "roberto.alves@exemplo.com",
    },
    data: new Date(),
    valor: 25.5,
    status: "em_entrega",
    endereco: {
      rua: "Av. Brigadeiro Faria Lima, 1500",
      bairro: "Jardim Paulistano",
      cidade: "São Paulo",
      estado: "SP",
    },
    pagamento: {
      metodo: "cartao",
      troco: null,
    },
    items: [{ id: "11", nome: "Açaí Premium (P)", quantidade: 1, preco: 25.5 }],
    observacoes: "Sem contato, deixar na portaria",
    createdAt: new Date(),
  },
];
