import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

import { PRODUCTS } from '../constants/Products';
import { CartContext } from '../providers';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState({});

  const { getCartCount, getCartData, saveCartData } = useContext(CartContext);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);

    const scannedProduct = PRODUCTS.find((item) => item.barcode === parseInt(data, 10));

    setProduct(scannedProduct);
  };

  const handleAddToCart = async (scannedProduct: any) => {
    let newCartItems: any[] = [];
    const cartArr = await getCartData();

    try {
      const cartIndex = cartArr.findIndex((item) => item.id === scannedProduct.id);

      if (cartIndex === -1) {
        if (cartArr.length !== 0) newCartItems = cartArr;

        scannedProduct.quantity = 1;
        scannedProduct.totalPrice = scannedProduct.price;

        newCartItems.push(scannedProduct);
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

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const renderResults = () => {
    if (scanned && product !== undefined) {
      return (
        <View style={styles.resultWrapper}>
          <Text style={styles.itemCategory}>{product.category}</Text>
          <Text style={styles.itemName}>{product.display_name}</Text>
          <Text style={styles.itemPrice}>P {product.price}</Text>

          <View style={styles.scannerCTA}>
            <View style={{ width: '50%', paddingRight: 5 }}>
              <Button title="Add to Cart" onPress={() => handleAddToCart(product)} />
            </View>
            <View style={{ width: '50%', paddingLeft: 5 }}>
              <Button title="Scan Again" onPress={() => setScanned(false)} />
            </View>
          </View>
        </View>
      );
    }

    if (scanned && product === undefined) {
      return (
        <View style={styles.resultWrapper}>
          <Text style={styles.notFoundText}>Product not found</Text>

          <View style={styles.scannerCTA}>
            <Button title="Scan Again" onPress={() => setScanned(false)} />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.resultWrapper}>
        <Text style={styles.notFoundText}>Scan product barcode</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannerWrapper}>
        {scanned && <View style={styles.blur} />}
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {renderResults()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 50,
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
  scannerWrapper: {
    position: 'relative',
    height: '62.5%',
    width: '100%',
    zIndex: -1,
  },
  scanner: {
    position: 'absolute',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    opacity: 0.8,
    zIndex: 1000,
  },
  resultWrapper: {
    padding: 15,
  },
  itemName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    letterSpacing: 1,
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    marginBottom: 20,
  },
  itemCategory: {
    fontSize: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#ddd',
    paddingVertical: 2,
    padding: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  scannerCTA: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
  },
});
