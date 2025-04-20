"use client";
import { IAddress } from "@/types/address";
import { Cart, CartProduct } from "@/types/cart";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { createContext } from "react";

const districts = [
  { value: 3.0, district: "Quietude" },
  { value: 4.0, district: "Tupi" },
  { value: 4.0, district: "Ocian" },
  { value: 4.0, district: "Anhanguera" },
  { value: 4.0, district: "Tupiry" },
  { value: 4.0, district: "Caieiras" },
  { value: 5.0, district: "Mirim" },
  { value: 5.0, district: "Antártica" },
  { value: 6.0, district: "Aloha" },
  { value: 6.0, district: "Aviação" },
  { value: 6.0, district: "Vila São Jorge" },
  { value: 7.0, district: "Vila Sônia" },
  { value: 7.0, district: "Glória" },
  { value: 7.0, district: "Guilhermina" },
  { value: 7.0, district: "Maracanã" },
  { value: 8.0, district: "Ribeirópolis" },
  { value: 8.0, district: "Esmeralda" },
  { value: 8.0, district: "Curva do S" },
  { value: 8.0, district: "Sitio do campo (Tude Bastos)" },
  { value: 8.0, district: "Boqueirão" },
  { value: 9.0, district: "Melvi" },
  { value: 9.0, district: "Samambaia" },
  { value: 10.0, district: "Forte" },
  { value: 10.0, district: "Caiçara" },
];

export interface CartContextProps {
  setAddress: (address: IAddress) => void;
  handleAddCartItem: (item: CartProduct) => void;
  handleRemoveCartItem: (item: CartProduct) => void;
  handleChangeQuantity: (cartProduct: CartProduct, quantity: number) => void;
  setPaymentMethod: (paymentMethod: "pix" | "money" | "card") => void;
  setPaymentChange: (paymentChange: string) => void;
  cart: Cart;
  setObservation: (observation: string) => void;
  cleanCart: () => void;
  toggleIsWithdrawal: (isWithdrawal: boolean) => void;
}

const CartContext = createContext<CartContextProps>({
  setAddress: () => {},
  handleChangeQuantity: () => {},
  handleAddCartItem: () => {},
  handleRemoveCartItem: () => {},
  cart: {} as Cart,
  setPaymentMethod: () => {},
  setPaymentChange: () => {},
  setObservation: () => {},
  cleanCart: () => {},
  toggleIsWithdrawal: () => {},
});

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<Cart>({
    addressId: "",
    addressDistrict: "",
    products: [],
    discount: 0,
    deliveryCost: 0,
    paymentMethod: "",
    observation: "",
    paymentChange: "",
    isWithdrawal: false,
  });

  useEffect(() => {
    if (!localStorage) return;
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCart(JSON.parse(cart));
    }
  }, []);

  useEffect(() => {
    if (!localStorage) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddCartItem = useCallback(
    (cartProduct: CartProduct) => {
      const products = [...cart.products, cartProduct];
      setCart({
        ...cart,
        products,
      });
    },
    [cart]
  );

  const handleRemoveCartItem = useCallback(
    (cartProduct: CartProduct) => {
      const products = cart.products.filter(
        (item) => item.id !== cartProduct.id
      );
      setCart({
        ...cart,
        products,
      });
    },
    [cart]
  );

  const handleChangeQuantity = useCallback(
    (cartProduct: CartProduct, quantity: number) => {
      if (quantity < 0) {
        return;
      }

      const products = cart.products.map((item) => {
        if (item.id === cartProduct.id) {
          return {
            ...item,
            quantity,
            price: item.unitPrice * quantity,
          };
        }
        return item;
      });

      setCart({
        ...cart,
        products: products,
      });
    },
    [cart]
  );

  const setAddress = useCallback(
    (address: IAddress) => {
      setCart({
        ...cart,
        addressDistrict: address.district,
        addressId: address.id,
        deliveryCost:
          districts.find((d) => d.district === address.district)?.value || 0,
      });
    },
    [cart]
  );

  const setPaymentMethod = useCallback(
    (paymentMethod: "money" | "card" | "pix") => {
      setCart({
        ...cart,
        paymentMethod,
      });
    },
    [cart]
  );

  const setPaymentChange = useCallback(
    (paymentChange: string) => {
      setCart({
        ...cart,
        paymentChange,
      });
    },
    [cart]
  );

  const setObservation = useCallback(
    (observation: string) => {
      setCart({
        ...cart,
        observation,
      });
    },
    [cart]
  );

  const toggleIsWithdrawal = useCallback(
    (isWithdrawal: boolean) => {
      setCart({
        ...cart,
        isWithdrawal,
        deliveryCost: isWithdrawal ? 0 : cart.deliveryCost,
        addressId: isWithdrawal ? "" : cart.addressId,
        addressDistrict: isWithdrawal ? "" : cart.addressDistrict,
      });
    },
    [cart]
  );

  const cleanCart = useCallback(() => {
    setCart({
      addressId: "",
      addressDistrict: "",
      products: [],
      discount: 0,
      deliveryCost: 0,
      paymentMethod: "",
      observation: "",
      paymentChange: "",
      isWithdrawal: false,
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddCartItem,
        handleRemoveCartItem,
        handleChangeQuantity,
        setAddress,
        setPaymentMethod,
        setPaymentChange,
        setObservation,
        cleanCart,
        toggleIsWithdrawal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};
