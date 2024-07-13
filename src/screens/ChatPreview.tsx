import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  channelsMessagesSelector,
  newMessagesSelector,
} from '../store/channel/channelSelector.ts';
import {useGetChannelByNickNameQuery} from '../api/channelApi.ts';

import {useAppDispatch} from '../store';
import {channelAction} from '../store/channel/channelSlice.ts';

import Search from "../shared/ui/Search.tsx";

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
      <View style={{ paddingLeft: 10, paddingRight: 10}}>
        <Search
            value={name}
            onChangeText={setName}
        />
      </View>
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


  const channelsMessages = useSelector(channelsMessagesSelector);
  const currentMessages = channelsMessages[name];
  const lastMessage = currentMessages?.[0];


  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Вc', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const day = daysOfWeek[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${hours}:${minutes}`;
  };

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
      <View style={styles.round}>
        <Text style={{ fontSize: 30}}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.preview}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastMessage}>{lastMessage?.text || " "}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.date}>
          {lastMessage ? formatTime(lastMessage?.createdAt?.toString()) : " "}
        </Text>
        {newMessages > 0 && (
            <View style={styles.newMessages}>
              <Text style={styles.newMessagesAmount}>
                {newMessages.toString()}
              </Text>
            </View>
        )}
      </View>


      {/*<View style={styles.deleteButton}>*/}
      {/*  <Text style={styles.deleteButtonText}>{data.ip}</Text>*/}

      {/*  {newMessages > 0 && (*/}
      {/*    <View style={styles.messageCountBlock}>*/}
      {/*      <Text style={styles.messageCount}>{newMessages}</Text>*/}
      {/*    </View>*/}
      {/*  )}*/}
      {/*</View>*/}

    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#F7F7F7',
  },
  itemContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
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
  round: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#F3F3F3',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  lastMessage:{
    height: 40
  },
  name:{
    fontSize: 16,
    fontWeight: '500',
    color: '#000000E5'
  },
  preview:{
    width: '65%'
  },
  info:{
    height: '100%'
  },
  newMessages:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    borderRadius: 10,
    backgroundColor: '#5075F6',
    padding: 1,
    marginLeft: 38,
    marginTop: 12
  },
  newMessagesAmount:{
    color: '#fff'
  }
});

export default DialogsScreen;
