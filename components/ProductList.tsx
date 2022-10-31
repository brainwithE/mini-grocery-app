import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';

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
      <Text style={styles.itemName}>{props.product.display_name}</Text>
      <Text style={styles.itemCategory}>{props.product.category}</Text>
      <Text>P {props.product.price}</Text>
    </View>
    <View style={{ width: '30%', alignSelf: 'flex-end' }}>
      <TouchableOpacity style={styles.button} onPress={() => props.addToCart(props.product)}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProductList(props: ProductListProps): JSX.Element {
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
    marginBottom: 20,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 10,
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
