import { useNavigation } from '@react-navigation/native';
import { SectionList, StyleSheet, TouchableOpacity } from 'react-native';

import ProductItem from './ProductItem';
import { Text, View } from './Themed';

interface CategoryListProps {
  data: any;
  handleAddToCart: Function;
  handleCategorySelection: Function;
}

export default function CategoryList(props: CategoryListProps): JSX.Element {
  const navigation = useNavigation();

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <SectionList
        sections={props.data}
        keyExtractor={(item, index) => item.display_name + index}
        renderItem={({ item, index }) => {
          if (index > 3) return null;

          return <ProductItem product={item} addToCart={props.handleAddToCart} hideTag />;
        }}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{section.category}</Text>
            <TouchableOpacity
              onPress={() => {
                props.handleCategorySelection(section);
                navigation.navigate('CategoryDetails');
              }}>
              <Text style={{ color: '#19a4df', textDecorationLine: 'underline' }}>See More</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// const styles = StyleSheet.create({});
