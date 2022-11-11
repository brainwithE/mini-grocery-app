import { FlatList } from 'react-native';

import ProductItem from './ProductItem';
import { View } from './Themed';

interface ProductListProps {
  searchQuery: string;
  data: any;
  handleAddToCart: Function;
}

export default function ProductList(props: ProductListProps): JSX.Element {
  const renderItem = ({ item }: any) => {
    const query = props.searchQuery.toUpperCase().trim().replace(/\s/g, '');
    if (
      item.display_name.toUpperCase().includes(query) ||
      item.brand.toUpperCase().includes(query) ||
      item.category.toUpperCase().includes(query)
    ) {
      return <ProductItem product={item} addToCart={props.handleAddToCart} />;
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

// const styles = StyleSheet.create({});
