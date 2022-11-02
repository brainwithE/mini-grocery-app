import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, createContext } from 'react';

export const CartContext = createContext({});

export const CartProvider = ({ children }) => {
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

  const saveCartData = async (cartArr) => {
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
