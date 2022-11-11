import { useContext, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

import { buildCategoryList } from '../builders/buildCategoryList';
import { Text, View } from '../components/Themed';
import { PRODUCTS } from '../constants/Products';
import { CartContext } from '../providers';
import { RootTabScreenProps } from '../types';

interface Category {
  category: string;
  data: Product[];
}

interface Product {
  id: number;
  display_name: string;
  barcode: number;
  price: number;
  brand: string;
}

export default function CategoriesScreen({ navigation }: RootTabScreenProps<'Categories'>) {
  const [categories, setCategories] = useState([]);

  const { setSelectedCategory } = useContext(CartContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const categories = buildCategoryList(PRODUCTS);
      setCategories(categories);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <ScrollView>
        {categories.map((item: Category) => (
          <TouchableOpacity
            key={item.category}
            style={{
              height: 50,
              margin: 5,
              backgroundColor: '#f8f8f8',
              padding: 10,
            }}
            onPress={() => {
              setSelectedCategory(item);
              navigation.navigate('CategoryDetails');
            }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>{item.category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
