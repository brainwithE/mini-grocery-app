import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Text, View } from './Themed';

interface Cart {
  product: Product;
  decreaseQty: (id: number) => void;
  increaseQty: (id: number) => void;
  removeItem: (id: number) => void;
}
interface Product {
  id: number;
  display_name: string;
  barcode: number;
  price: number;
  brand: string;
  category: string;
  quantity: number;
  totalPrice: number;
}

export default function CartItem(props: Cart): JSX.Element {
  return (
    <View style={styles.itemWrapper}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: '70%' }}>
          <Text style={styles.itemName}>{props.product.display_name}</Text>
          <Text style={styles.itemPrice}>P {props.product.price}</Text>
        </View>
        <Text>P {props.product.totalPrice}</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.itemQtyWrapper}>
          <Text style={{ marginRight: 5 }}>Qty:</Text>
          <TouchableOpacity onPress={() => props.decreaseQty(props.product.id)}>
            <View
              style={{
                borderRadius: 100,
                marginRight: 20,
                padding: 4,
                borderWidth: 1,
                borderColor: '#B9B9B9',
                opacity: 0.5,
              }}>
              <MaterialCommunityIcons
                name="minus"
                style={{
                  fontSize: 16,
                  color: '#777777',
                }}
              />
            </View>
          </TouchableOpacity>
          <Text>{props.product.quantity}</Text>
          <TouchableOpacity onPress={() => props.increaseQty(props.product.id)}>
            <View
              style={{
                borderRadius: 100,
                marginLeft: 20,
                padding: 4,
                borderWidth: 1,
                borderColor: '#B9B9B9',
                opacity: 0.5,
              }}>
              <MaterialCommunityIcons
                name="plus"
                style={{
                  fontSize: 16,
                  color: '#777777',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => props.removeItem(props.product.id)}>
            <MaterialCommunityIcons
              name="delete-outline"
              style={{
                fontSize: 16,
                color: '#777777',
                backgroundColor: '#F0F0F3',
                padding: 7,
                borderRadius: 100,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 12,
  },
  itemPriceWrapper: {
    width: '20%',
    textAlign: 'right',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  itemQtyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 20,
  },
});
