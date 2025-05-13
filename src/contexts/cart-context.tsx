"use client";
import { IAddress } from "@/types/address";
import { Cart, CartProduct } from "@/types/cart";
import { ICoupon } from "@/types/coupon";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createContext } from "react";

const districts = [
  { value: 4.0, district: "Quietude" },
  { value: 5.0, district: "Tupi" },
  { value: 5.0, district: "Ocian" },
  { value: 5.0, district: "Anhanguera" },
  { value: 5.0, district: "Tupiry" },
  { value: 5.0, district: "Caieiras" },
  { value: 6.0, district: "Mirim" },
  { value: 6.0, district: "Antártica" },
  { value: 7.0, district: "Aloha" },
  { value: 7.0, district: "Aviação" },
  { value: 7.0, district: "Vila São Jorge" },
  { value: 8.0, district: "Vila Sônia" },
  { value: 8.0, district: "Glória" },
  { value: 8.0, district: "Guilhermina" },
  { value: 8.0, district: "Maracanã" },
  { value: 9.0, district: "Ribeirópolis" },
  { value: 9.0, district: "Esmeralda" },
  { value: 9.0, district: "Curva do S" },
  { value: 9.0, district: "Sitio do campo (Tude Bastos)" },
  { value: 9.0, district: "Boqueirão" },
  { value: 10.0, district: "Melvi" },
  { value: 10.0, district: "Samambaia" },
  { value: 11.0, district: "Forte" },
  { value: 11.0, district: "Caiçara" },
];

export interface CartContextProps {
  setAddress: (address: IAddress) => void;
  handleAddCartItem: (item: CartProduct) => void;
  handleAddManyCartItems: (item: CartProduct[]) => void;
  handleRemoveCartItem: (item: CartProduct) => void;
  handleChangeQuantity: (cartProduct: CartProduct, quantity: number) => void;
  setPaymentMethod: (paymentMethod: "pix" | "money" | "card") => void;
  setPaymentChange: (paymentChange: string) => void;
  cart: Cart;
  setObservation: (observation: string) => void;
  cleanCart: () => void;
  toggleIsWithdrawal: (isWithdrawal: boolean) => void;
  calculateTotalAndSubtotal: {
    subtotal: number;
    total: number;
  };
  addDiscount: (coupon: ICoupon) => void;
}

const CartContext = createContext<CartContextProps>({
  setAddress: () => {},
  handleChangeQuantity: () => {},
  handleAddCartItem: () => {},
  handleAddManyCartItems: () => {},
  handleRemoveCartItem: () => {},
  cart: {} as Cart,
  setPaymentMethod: () => {},
  setPaymentChange: () => {},
  setObservation: () => {},
  cleanCart: () => {},
  toggleIsWithdrawal: () => {},
  calculateTotalAndSubtotal: {
    subtotal: 0,
    total: 0,
  },
  addDiscount: () => {},
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
  const handleAddManyCartItems = useCallback(
    (cartProducts: CartProduct[]) => {
      const products = [...cart.products, ...cartProducts];
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

  const calculateTotalAndSubtotal = useMemo(() => {
    const subtotal = cart.products.reduce((acc, item) => acc + item.price, 0);
    const total = subtotal - (cart.discount || 0) + cart.deliveryCost;
    return { subtotal, total };
  }, [cart]);

  const addDiscount = useCallback(
    (coupon: ICoupon) => {
      const discountValue =
        coupon.type === "PERCENT"
          ? (calculateTotalAndSubtotal.subtotal * coupon.discount) / 100
          : coupon.discount;
      setCart({
        ...cart,
        discount: discountValue,
        couponId: coupon.id,
        couponCode: coupon.code,
      });
    },
    [setCart, cart, calculateTotalAndSubtotal]
  );

  return (
    <CartContext.Provider
      value={{
        calculateTotalAndSubtotal,
        addDiscount,
        cart,
        handleAddCartItem,
        handleAddManyCartItems,
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
