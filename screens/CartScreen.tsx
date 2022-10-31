import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import CartItem from '../components/CartItem';
import { View, Text } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function CartScreen({ navigation }: RootTabScreenProps<'Cart'>) {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const { getItem, setItem } = useAsyncStorage('cartItems');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromStorage();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (cart) {
      const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
      setSubtotal(cartSubtotal);
    }
  }, [cart]);

  const getDataFromStorage = async () => {
    const jsonValue = await getItem();
    const cartArr = JSON.parse(jsonValue);

    setCart(cartArr);
  };

  const getCartIndex = (cartArray: { id: number }[], id: number) => {
    return cartArray.findIndex((item: { id: number }) => item.id === id);
  };

  const handleRemoveItem = async (productID: number) => {
    const jsonValue = await getItem();
    const cartArr = JSON.parse(jsonValue);

    if (cartArr) {
      const cartIndex = getCartIndex(cartArr, productID);
      cartArr.splice(cartIndex, 1);

      await setItem(JSON.stringify(cartArr));
      getDataFromStorage();
    }
  };

  const handleIncreaseQty = async (productID: number) => {
    const jsonValue = await getItem();
    const cartArr = JSON.parse(jsonValue);

    if (cartArr) {
      const cartIndex = getCartIndex(cartArr, productID);

      cartArr[cartIndex].quantity = cartArr[cartIndex].quantity + 1;
      cartArr[cartIndex].totalPrice = cartArr[cartIndex].quantity * cartArr[cartIndex].price;

      await setItem(JSON.stringify(cartArr));
      getDataFromStorage();
    }
  };

  const handleDecreaseQty = async (productID: number) => {
    const jsonValue = await getItem();
    const cartArr = JSON.parse(jsonValue);

    if (cartArr) {
      const cartIndex = getCartIndex(cartArr, productID);

      if (cartArr[cartIndex].quantity > 1) {
        cartArr[cartIndex].quantity = cartArr[cartIndex].quantity - 1;
        cartArr[cartIndex].totalPrice = cartArr[cartIndex].quantity * cartArr[cartIndex].price;
      } else {
        cartArr.splice(cartIndex, 1);
      }

      await setItem(JSON.stringify(cartArr));
      getDataFromStorage();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {cart.map((item) => (
            <CartItem
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
        </View>

        <View style={styles.cartCTA}>
          <TouchableOpacity style={styles.checkoutButton}>
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
