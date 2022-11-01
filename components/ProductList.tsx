import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { CartContext } from '../providers';

import { Text, View } from './Themed';

interface ProductItem {
  id: number;
  display_name: string;
  barcode: number;
  price: number;
  brand: string;
  category: string;
}

interface CartItem {
  id: number;
  display_name: string;
  barcode: number;
  price: number;
  brand: string;
  category: string;
  quantity: number;
  totalPrice: number;
}

interface ProductListProps {
  searchQuery: string;
  data: any;
  // data: ProductItem[];
}

interface ItemProps {
  product: ProductItem;
  addToCart: Function;
}

const Item = (props: ItemProps): JSX.Element => (
  <View style={styles.itemWrapper}>
    <View style={{ width: '70%' }}>
      <Text style={styles.itemCategory}>{props.product.category}</Text>
      <Text style={styles.itemName}>{props.product.display_name}</Text>
      <Text>P {props.product.price}</Text>
    </View>
    <View style={{ alignSelf: 'flex-end' }}>
      <TouchableOpacity
        onPress={() => props.addToCart(props.product)}
        accessibilityHint="Add to Cart">
        <MaterialCommunityIcons
          name="cart-plus"
          style={{
            fontSize: 16,
            color: '#777777',
            backgroundColor: '#F0F0F3',
            padding: 7,
            borderRadius: 100,
            alignSelf: 'flex-end',
          }}
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProductList(props: ProductListProps): JSX.Element {
  const { getCartCount } = useContext(CartContext);

  const handleAddToCart = async (product: CartItem) => {
    let newCartItems: any[] = [];

    const cartJson = await AsyncStorage.getItem('cartItems');
    const cartObj = JSON.parse(cartJson);

    try {
      if (cartJson) {
        newCartItems = cartObj;

        const cartIndex = newCartItems.findIndex((item) => item.id === product.id);

        if (cartIndex > -1) {
          const newQty = newCartItems[cartIndex].quantity + 1;

          newCartItems[cartIndex].quantity = newQty;
          newCartItems[cartIndex].totalPrice = newQty * newCartItems[cartIndex].price;
        } else {
          product.quantity = 1;
          product.totalPrice = product.price;

          newCartItems.push(product);
        }
      } else {
        product.quantity = 1;
        product.totalPrice = product.price;

        newCartItems.push(product);
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(newCartItems));
      await getCartCount();
    } catch (error) {
      return error;
    }
  };

  const renderItem = ({ item }: any) => {
    const query = props.searchQuery.toUpperCase().trim().replace(/\s/g, '');
    if (
      item.display_name.toUpperCase().includes(query) ||
      item.brand.toUpperCase().includes(query) ||
      item.category.toUpperCase().includes(query)
    ) {
      return <Item product={item} addToCart={handleAddToCart} />;
    }

    return null;
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <FlatList
        data={props.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    boxShadow: '0px 5px 15px #85a6bf1a',
    padding: 15,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#f3f3f3',
    paddingVertical: 2,
    padding: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'green',
    padding: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
