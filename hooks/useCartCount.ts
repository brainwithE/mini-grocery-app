import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function useCartCount() {
  const [cartCount, setCartCount] = useState(0);

  const { getItem } = useAsyncStorage('cartItems');

  const getDataFromStorage = async () => {
    const jsonValue = await getItem();
    const cartArr = JSON.parse(jsonValue) || [];

    const totalCount = cartArr.reduce(
      (acc: any, item: { quantity: any }) => acc + item.quantity,
      0
    );
    setCartCount(totalCount);
  };

  useEffect(() => {
    getDataFromStorage();
  }, [cartCount]);

  return cartCount;
}
