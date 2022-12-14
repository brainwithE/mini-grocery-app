import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';

import CartItem from '../components/CartItem';
import { View, Text } from '../components/Themed';
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

export default function CartScreen({ navigation }: RootTabScreenProps<'Cart'>) {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const { getCartCount, getCartData, saveCartData } = useContext(CartContext);

  const hasItems = cart.length > 0;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromStorage();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (cart) {
      const cartSubtotal = cart.reduce((acc, item: CartItemType) => acc + item.totalPrice, 0);
      setSubtotal(cartSubtotal);
    }
  }, [cart]);

  const getDataFromStorage = async () => {
    const cartArr = await getCartData();
    console.log('cartArr', cartArr);
    setCart(cartArr);
  };

  const getCartIndex = (cartArray: { id: number }[], id: number) => {
    return cartArray.findIndex((item: { id: number }) => item.id === id);
  };

  const handleRemoveItem = async (productID: number) => {
    const cartArr = await getCartData();

    if (cartArr) {
      const cartIndex = getCartIndex(cartArr, productID);
      cartArr.splice(cartIndex, 1);

      await saveCartData(cartArr);
      await getDataFromStorage();
      await getCartCount();
      await ToastAndroid.show('Item removed from cart.', ToastAndroid.SHORT);
    }
  };

  const handleIncreaseQty = async (productID: number) => {
    const cartArr = await getCartData();

    if (cartArr) {
      const cartIndex = getCartIndex(cartArr, productID);

      cartArr[cartIndex].quantity = cartArr[cartIndex].quantity + 1;
      cartArr[cartIndex].totalPrice = cartArr[cartIndex].quantity * cartArr[cartIndex].price;

      console.log('cartArr', cartArr);

      await saveCartData(cartArr);
      await getDataFromStorage();
      await getCartCount();
    }
  };

  const handleDecreaseQty = async (productID: number) => {
    const cartArr = await getCartData();

    if (cartArr) {
      const cartIndex = getCartIndex(cartArr, productID);

      if (cartArr[cartIndex].quantity > 1) {
        cartArr[cartIndex].quantity = cartArr[cartIndex].quantity - 1;
        cartArr[cartIndex].totalPrice = cartArr[cartIndex].quantity * cartArr[cartIndex].price;
      } else {
        cartArr.splice(cartIndex, 1);
      }

      await saveCartData(cartArr);
      await getDataFromStorage();
      await getCartCount();
    }
  };

  const handleCheckoutAlert = () =>
    Alert.alert('Coming Soon', 'Checkout feature is not working at the moment', [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);

  if (!hasItems) {
    return (
      <View style={styles.container}>
        <View style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <MaterialCommunityIcons
            name="cart"
            style={{
              fontSize: 50,
              textAlign: 'center',
              color: '#777777',
              padding: 20,
            }}
          />
          <Text style={{ fontSize: 20, textAlign: 'center' }}>Your Cart is Empty</Text>
          <Text style={styles.ctaLink}>Start shopping</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {cart.map((item: CartItemType) => (
            <CartItem
              key={item.id}
              product={item}
              removeItem={handleRemoveItem}
              increaseQty={handleIncreaseQty}
              decreaseQty={handleDecreaseQty}
            />
          ))}
        </View>

        <View style={styles.orderInfoSection}>
          <Text style={styles.sectionTitle}>Order Info</Text>

          <View style={styles.orderInfoItem}>
            <Text style={styles.orderInfoItemLabel}>Subtotal</Text>
            <Text style={styles.orderInfoItemValue}>P {subtotal}</Text>
          </View>

          <View style={styles.orderInfoItem}>
            <Text style={styles.orderInfoTotalLabel}>Total</Text>
            <Text style={styles.orderInfoTotalValue}>P {subtotal}</Text>
          </View>
        </View>

        <View style={styles.cartCTA}>
          <TouchableOpacity onPress={() => handleCheckoutAlert()} style={styles.checkoutButton}>
            <Text style={styles.buttonText}>CHECKOUT (P {subtotal})</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.ctaLink}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  orderInfoSection: {
    paddingHorizontal: 16,
    marginTop: 40,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 20,
  },
  orderInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderInfoItemLabel: {
    fontSize: 12,
    fontWeight: '400',
    maxWidth: '80%',
    color: '#000',
    opacity: 0.5,
  },
  orderInfoItemValue: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    opacity: 0.8,
  },
  orderInfoTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '80%',
    color: '#000',
    opacity: 0.5,
  },
  orderInfoTotalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    opacity: 0.8,
  },
  cartCTA: {
    padding: 16,
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  ctaLink: {
    textAlign: 'center',
    paddingVertical: 10,
  },
});
