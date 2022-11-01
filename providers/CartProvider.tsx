import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, createContext } from 'react';

export const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const { getItem, setItem } = useAsyncStorage('cartItems');

  useEffect(() => {
    getCartCount();
  }, []);

  const getCartData = async () => {
    const jsonValue = await getItem();
    const cartArr = JSON.parse(jsonValue);

    return cartArr;
  };

  const getCartCount = async () => {
    const cartArr = await getCartData();

    const totalCount = cartArr.reduce(
      (acc: any, item: { quantity: any }) => acc + item.quantity,
      0
    );
    setCartCount(totalCount);
  };

  const saveCartData = async (cartArr) => {
    await setItem(JSON.stringify(cartArr));
  };

  return (
    <CartContext.Provider value={{ cartCount, getCartCount, getCartData, saveCartData }}>
      {children}
    </CartContext.Provider>
  );
};
