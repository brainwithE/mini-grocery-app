import { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';

import { buildCategoryList } from '../builders/buildCategoryList';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import { View } from '../components/Themed';
import { FEATURED_PRODUCT_CATEGORIES, PRODUCTS } from '../constants/Products';
import { CartContext } from '../providers';
import { RootTabScreenProps } from '../types';

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

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [activateSearch, setActivateSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<object[]>([]);
  const [categories, setCategories] = useState<object[]>([]);

  const { getCartCount, getCartData, saveCartData } = useContext(CartContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromStorage();
    });

    return unsubscribe;
  }, [navigation]);

  const getDataFromStorage = () => {
    const categories = buildCategoryList(PRODUCTS);

    const categoryData = categories.filter((data) =>
      FEATURED_PRODUCT_CATEGORIES.includes(data.category)
    );

    setCategories(categoryData);
    setProducts(PRODUCTS);
  };

  const handleAddToCart = async (product: CartItem) => {
    let newCartItems: any[] = [];

    const cartArr = await getCartData();

    try {
      const cartIndex = cartArr.findIndex((item) => item.id === product.id);

      if (cartIndex === -1) {
        if (cartArr.length !== 0) newCartItems = cartArr;

        product.quantity = 1;
        product.totalPrice = product.price;

        newCartItems.push(product);
      }

      if (cartIndex > -1) {
        newCartItems = cartArr;

        const newQty = newCartItems[cartIndex].quantity + 1;

        newCartItems[cartIndex].quantity = newQty;
        newCartItems[cartIndex].totalPrice = newQty * newCartItems[cartIndex].price;
      }

      await saveCartData(newCartItems);
      await getCartCount();
    } catch (error) {
      return error;
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        clicked={false}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActivateSearch={setActivateSearch}
      />

      {activateSearch && searchQuery !== '' ? (
        <ProductList data={products} searchQuery={searchQuery} handleAddToCart={handleAddToCart} />
      ) : (
        <CategoryList data={categories} handleAddToCart={handleAddToCart} />
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
