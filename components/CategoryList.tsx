import { SectionList, StyleSheet } from 'react-native';

import ProductItem from './ProductItem';
import { Text, View } from './Themed';

interface CategoryListProps {
  data: any;
  handleAddToCart: Function;
}

export default function CategoryList(props: CategoryListProps): JSX.Element {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <SectionList
        sections={props.data}
        keyExtractor={(item, index) => item.display_name + index}
        renderItem={({ item, index }) => {
          if (index > 3) return null;

          return <ProductItem product={item} addToCart={props.handleAddToCart} hideTag />;
        }}
        renderSectionHeader={({ section: { category } }) => (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{category}</Text>
            <Text>See More</Text>
          </View>
        )}
      />
    </View>
  );
}

// const styles = StyleSheet.create({});
