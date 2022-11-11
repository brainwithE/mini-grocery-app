import { useContext, useEffect } from 'react';
import { FlatList, ToastAndroid } from 'react-native';

import ProductItem from '../components/ProductItem';
import { View } from '../components/Themed';
import { CartContext } from '../providers';
import { RootTabScreenProps } from '../types';

interface CartItemType {
  id: number;
  display_name: string;
  barcode: number;
  price: number;
  brand: string;
  quantity: number;
  totalPrice: number;
  category: string;
}

export default function CategoryDetailsScreen({
  navigation,
}: RootTabScreenProps<'CategoryDetails'>) {
  const { getCartCount, getCartData, saveCartData, selectedCategory } = useContext(CartContext);

  useEffect(() => {
    navigation.setOptions({ title: selectedCategory.category });
  }, []);

  const handleAddToCart = async (product: any) => {
    let newCartItems: any[] = [];

    const cartArr = await getCartData();

    try {
      const cartIndex = cartArr.findIndex((item: CartItemType) => item.id === product.id);

      if (cartIndex === -1) {
        if (cartArr.length !== 0) newCartItems = cartArr;

        product.quantity = 1;
        product.totalPrice = product.price;

        newCartItems.push(product);
      }

      if (cartIndex > -1) {
        newCartItems = cartArr;

        const newQty = newCartItems[cartIndex].quantity + 1;

        newCartItems[cartIndex].quantity = newQty;
        newCartItems[cartIndex].totalPrice = newQty * newCartItems[cartIndex].price;
      }

      await saveCartData(newCartItems);
      await getCartCount();
      await ToastAndroid.show('Item added to cart.', ToastAndroid.SHORT);
    } catch (error) {
      return error;
    }
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <FlatList
        data={selectedCategory.data}
        renderItem={({ item }) => (
          <ProductItem product={item} addToCart={handleAddToCart} hideTag />
        )}
        keyExtractor={(item) => item.id}
        initialNumToRender={5}
      />
    </View>
  );
}
