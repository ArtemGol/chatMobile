import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IContact} from '../api/dto/IContacts.ts';

const ContactProfile = () => {
  const {navigate} = useNavigation<any>();
  const route = useRoute();
  const {name, nickname, phoneNumbers, channel} = route.params as IContact;

  const onHandleInviteRoom = () => {
    if (channel) {
      navigate('GiftedChatScreen', {
        roomID: channel.ip,
        userName: channel.port,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/*<Text style={styles.mainheader}>{name}</Text>*/}
      <View style={styles.roundContainer}>
        <View style={styles.round}>
          <Text style={styles.firstLetter}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      {/*<Text style={styles.status}>{channel ? 'подключен' : 'нет в сети'}</Text>*/}
      <View>
        <View style={styles.section}>
          {channel ? (
              <Text style={styles.label}>никнейм</Text>
          ):(
              <Text style={styles.label}>имя</Text>
          )}
          <Text style={styles.content}>{nickname}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>номер телефона</Text>
          <Text style={styles.content}>{phoneNumbers.join(', ')}</Text>
        </View>
        {channel && (
          <TouchableOpacity
            onPress={onHandleInviteRoom}
            style={styles.messageButton}>
            <Ionicons name="chatbox-outline" size={24} />
            <Text style={styles.messageButtonText}>Сообщение</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ContactProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mainheader: {
    color: '#000',
    textAlign: 'center',
    fontSize: 30,
    paddingBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  messageButton: {
    paddingLeft: 10,
    color: '#000000E5',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  messageButtonText: {
    color: '#000000E5',
    fontSize: 16,
    paddingLeft: 10,
  },
  round:{
    backgroundColor: '#E4E4E4',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstLetter:{
    fontSize: 48,
    color: '#00000033'
  },
  roundContainer:{
    alignItems: 'center',
    marginBottom: 30
  }
});
