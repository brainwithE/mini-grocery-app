import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, createContext } from 'react';

export const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const { getItem } = useAsyncStorage('cartItems');

  const getCartCount = async () => {
    const jsonValue = await getItem();
    const cartArr = JSON.parse(jsonValue) || [];

    const totalCount = cartArr.reduce(
      (acc: any, item: { quantity: any }) => acc + item.quantity,
      0
    );
    setCartCount(totalCount);
  };

  useEffect(() => {
    getCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, getCartCount }}>{children}</CartContext.Provider>
  );
};
