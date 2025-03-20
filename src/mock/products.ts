import { IProduct } from "@/types/product";
import { categories } from "./categories";

export const products: Array<IProduct> = [
  {
    id: "1",
    title: "Açaí 300ml",
    description: "Açaí com complementos e frutas a vontade no copo de 300ml",
    price: 15.99,
    status: "ativo",
    image: "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    categoryId: categories[0].id,
    category: categories[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    productVariants: [],
  },
  {
    id: "2",
    title: "Açaí 500ml",
    description: "Açaí com complementos e frutas a vontade no copo de 500ml",
    price: 19.99,
    status: "ativo",
    image: "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    categoryId: categories[0].id,
    category: categories[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    productVariants: [],
  },
  {
    id: "3",
    title: "Açaí 700ml",
    description: "Açaí com complementos e frutas a vontade no copo de 700ml",
    price: 21.99,
    status: "ativo",
    image: "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    categoryId: categories[0].id,
    category: categories[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    productVariants: [],
  },
  {
    id: "4",
    title: "Marmitex 1l",
    description:
      "Açaí com complementos e frutas a vontade na marmitex de 1l para toda a familia",
    price: 42.99,
    status: "ativo",
    image: "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    categoryId: categories[1].id,
    category: categories[1],
    createdAt: new Date(),
    updatedAt: new Date(),
    productVariants: [],
  },
  {
    id: "5",
    title: "Garrafa de Água 510ml",
    description: "Água 510ml",
    price: 2.99,
    status: "ativo",
    image: "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    categoryId: categories[2].id,
    category: categories[2],
    createdAt: new Date(),
    updatedAt: new Date(),
    productVariants: [],
  },
  {
    id: "6",
    title: "Coca Cola Lata 300ml",
    description: "Coca Cola Lata 300ml",
    price: 4.99,
    status: "ativo",
    image: "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    categoryId: categories[2].id,
    category: categories[2],
    createdAt: new Date(),
    updatedAt: new Date(),
    productVariants: [],
  },
  {
    id: "7",
    title: "Coca Cola Zero Lata 300ml",
    description: "Coca Cola Zero Lata 300ml",
    price: 4.99,
    status: "ativo",
    image: "https://acaidatribo.com.br/wp-content/uploads/2024/10/10102421.jpg",
    categoryId: categories[2].id,
    category: categories[2],
    createdAt: new Date(),
    updatedAt: new Date(),
    productVariants: [],
  },
];
