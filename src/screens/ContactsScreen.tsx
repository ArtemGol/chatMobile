import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import ContactPlug from '../components/Contact';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {contactsSelector} from '../store/contacts/contactsSelector.ts';
import Search from "../shared/ui/Search.tsx";

const Contacts = () => {
  const {navigate} = useNavigation<any>();
  const contacts = useSelector(contactsSelector);
    const [searchQuery, setSearchQuery] = useState('');

  const sortedContacts = [...contacts].sort((a, b) => {
    if (a.channel && !b.channel) {
      return -1;
    }
    if (!a.channel && b.channel) {
      return 1;
    }
    return 0;
  });

    const filteredContacts = sortedContacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <View style={styles.container}>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <Search
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ContactPlug
            item={item}
            onPress={() => {
              navigate('ContactProfile', item);
            }}
          />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={21}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
      backgroundColor: "#F7F7F7",
    flex: 1,
  },
});
