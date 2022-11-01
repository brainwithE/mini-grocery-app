import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import { View } from '../components/Themed';
import { PRODUCTS } from '../constants/Products';
import { RootTabScreenProps } from '../types';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [activateSearch, setActivateSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<object[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromStorage();
    });

    return unsubscribe;
  }, [navigation]);

  const getDataFromStorage = () => {
    setProducts(PRODUCTS);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        clicked={false}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActivateSearch={setActivateSearch}
      />
      {activateSearch && searchQuery !== '' && (
        <ProductList data={products} searchQuery={searchQuery} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '40%',
  },
});
