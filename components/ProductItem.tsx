import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import { Text, View } from './Themed';

interface ProductProps {
  id: number;
  display_name: string;
  barcode: number;
  price: number;
  brand: string;
  category: string;
}

interface ProductItemProps {
  product: ProductProps;
  addToCart: Function;
  hideTag?: boolean;
}

export default function ProductItem(props: ProductItemProps): JSX.Element {
  return (
    <View style={styles.itemWrapper}>
      <View style={{ width: '70%' }}>
        {!props.hideTag && <Text style={styles.itemCategory}>{props.product.category}</Text>}

        <Text style={styles.itemName}>{props.product.display_name}</Text>
        <Text>P {props.product.price}</Text>
      </View>
      <View style={{ alignSelf: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => props.addToCart(props.product)}
          accessibilityHint="Add to Cart">
          <MaterialCommunityIcons name="cart-plus" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
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
  buttonIcon: {
    fontSize: 16,
    color: '#777777',
    backgroundColor: '#F0F0F3',
    padding: 7,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
});
