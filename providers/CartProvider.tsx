import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, createContext } from 'react';

// type CartContextType = {
//   cartCount: number;
//   getCartCount: () => Promise<void>;
//   getCartData: () => Promise<void>;
//   saveCartData: (cartArr: ProductCart[]) => Promise<void>;
//   selectedCategory: Category | object;
//   setSelectedCategory: (state: Category) => void;
// };

// interface Category {
//   category: string;
//   data: Product[];
// }

// export const CartContext = createContext<CartContextType | null>(null);

interface Product {
  id: number;
  display_name: string;
  barcode: number;
  price: number;
  brand: string;
}

interface ProductCart extends Product {
  quantity: number;
  totalPrice: number;
}

interface Props {
  children: JSX.Element;
}

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: Props) => {
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState({});

  const { getItem, setItem } = useAsyncStorage('cartItems');

  useEffect(() => {
    getCartCount();
  }, []);

  const getCartData = async () => {
    try {
      const jsonValue = await getItem();
      const cartArr = await JSON.parse(jsonValue || '[]');

      return cartArr;
    } catch (error) {
      console.log('CartProvider - getCartData() error:', error);
    }
  };

  const getCartCount = async () => {
    const cartArr = await getCartData();

    const totalCount = await cartArr.reduce(
      (acc: any, item: { quantity: any }) => acc + item.quantity,
      0
    );

    await setCartCount(totalCount);
  };

  const saveCartData = async (cartArr: ProductCart[]) => {
    await setItem(JSON.stringify(cartArr));
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        getCartCount,
        getCartData,
        saveCartData,
        selectedCategory,
        setSelectedCategory,
      }}>
      {children}
    </CartContext.Provider>
  );
};
