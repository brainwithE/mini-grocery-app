import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, TextInput } from 'react-native';

import { View } from './Themed';

interface Props {
  clicked: boolean;
  searchQuery: string;
  setSearchQuery: Function;
  setActivateSearch: Function;
}

export default function SearchBar(props: Props): JSX.Element {
  const handleSearch = (value: any) => {
    props.setSearchQuery(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapperSearch} darkColor="#fff" lightColor="rgba(196, 196, 196, 0.5)">
        <TextInput
          style={styles.textInput}
          placeholder="Search Product, Brand"
          value={props.searchQuery}
          onChangeText={handleSearch}
          onFocus={() => props.setActivateSearch(true)}
        />

        {props.searchQuery !== '' && (
          <AntDesign
            name="closecircleo"
            size={20}
            color="black"
            style={styles.clear}
            onPress={() => handleSearch('')}
          />
        )}

        <AntDesign name="search1" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  wrapperSearch: {
    height: 40,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  textInput: {
    width: '80%',
    height: '100%',
  },
  clear: {
    marginRight: 10,
  },
});
