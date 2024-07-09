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
      <Text style={styles.mainheader}>{name}</Text>
      <Text style={styles.status}>{channel ? 'подключен' : 'отсутствует'}</Text>
      <View>
        <View style={styles.section}>
          <Text style={styles.label}>никнейм</Text>
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
    backgroundColor: '#FFF',
    paddingTop: 100,
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
});
