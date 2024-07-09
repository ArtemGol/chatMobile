import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  channelsMessagesSelector,
  newMessagesSelector,
} from '../store/channel/channelSelector.ts';
import {useGetChannelByNickNameQuery} from '../api/channelApi.ts';
import {Input} from '../components/Input.tsx';
import {useAppDispatch} from '../store';
import {channelAction} from '../store/channel/channelSlice.ts';

const DialogsScreen: React.FC = () => {
  const [name, setName] = useState('');
  const {data} = useGetChannelByNickNameQuery(name);
  const channelsMessages = useSelector(channelsMessagesSelector);
  const channels: string[] = Object.keys(channelsMessages);

  const channelsState = Array.from(
    new Set(data?.port === name ? [...channels, data?.port] : channels),
  ).filter(el => el?.toLowerCase().includes(name.toLowerCase()));

  return (
    <View style={styles.container}>
      <Input
        placeholder="Поиск диалога"
        value={name}
        onChangeText={setName}
        type={'labelDown'}
      />
      <FlatList
        data={channelsState}
        renderItem={({item}) => <RoomItem name={item} />}
        keyExtractor={item => item.toString()}
      />
    </View>
  );
};

const RoomItem = ({name}: {name: string}) => {
  const dispatch = useAppDispatch();
  const newMessages = useSelector(newMessagesSelector)[name] || 0;
  const {data} = useGetChannelByNickNameQuery(name);
  const {navigate} = useNavigation<any>();

  return data?.ip ? (
    <TouchableOpacity
      onPress={() => {
        dispatch(channelAction.clearNewMessagesByName(name));
        navigate('GiftedChatScreen', {
          roomID: data.ip,
          userName: name,
          withoutConnection: true,
        });
      }}
      style={styles.itemContainer}>
      <Text style={styles.roomID}>{name}</Text>
      <View style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>{data.ip}</Text>
        {newMessages > 0 && (
          <View style={styles.messageCountBlock}>
            <Text style={styles.messageCount}>{newMessages}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  roomID: {
    color: '#000',
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
  },
  messageCountBlock: {
    marginLeft: 10,
    backgroundColor: '#FF0000',
    borderRadius: 100,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageCount: {
    color: '#FFF',
  },
  deleteButtonText: {
    color: '#000',
    fontSize: 14,
  },
});

export default DialogsScreen;
