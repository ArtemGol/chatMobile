import React, {useState, useRef, useEffect} from 'react';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  Time,
} from 'react-native-gifted-chat';
import type {Socket} from 'socket.io-client';
import {useSelector} from 'react-redux';
import {userSelector} from '../store/auth/authSelector.ts';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {
  channelsMessagesSelector,
  connectionSelector,
} from '../store/channel/channelSelector.ts';
import {useAppDispatch} from '../store';
import {channelAction} from '../store/channel/channelSlice.ts';
import {GiftedChatRightHeader} from '../components/GiftedChatRightHeader.tsx';

export interface IncomingUser {
  id: string;
  name: string;
}

const GiftedChatScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const route = useRoute<{
    params: {roomID: string; userName: string};
  }>();
  const {roomID, userName} = route.params;
  const {username} = useSelector(userSelector);
  const connection = useSelector(connectionSelector);
  const channelsMessages = useSelector(channelsMessagesSelector);
  const currentMessages = channelsMessages[userName || username];
  const lastMessage = currentMessages?.[0];

  const [hasConnected, setHasConnected] = useState(true);
  const socketRef = useRef<Socket | null>(connection);

  useFocusEffect(() => {
    dispatch(channelAction.setCurrentRoomUser(userName));

    return () => {
      dispatch(channelAction.setCurrentRoomUser(''));
    };
  });

  useEffect(() => {
    connection?.emit('join room', {roomID, userName: username});

    return () => {
      connection?.emit('left room', {roomID, userName: username});
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastMessage?.text.includes('has left the chat')) {
      setHasConnected(false);
      navigation.setOptions({
        headerRight: () => <GiftedChatRightHeader isConnected={false} />,
      });
    }
    if (lastMessage?.text.includes('has joined the chat')) {
      setHasConnected(true);
      navigation.setOptions({
        headerRight: () => <GiftedChatRightHeader isConnected />,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  const sendMessage = (newMessages: IMessage[] = []) => {
    socketRef.current?.emit('send message', {
      roomID,
      message: newMessages[0].text,
      userName: username,
      id: newMessages[0]._id,
    });
    dispatch(
      channelAction.setChannelsWithMessages({
        roomID,
        port: userName,
        message: {
          text: newMessages[0].text,
          createdAt: new Date(),
          user: {_id: 2},
          _id: newMessages[0]._id,
        },
      }),
    );
  };

  return (
    <View
      style={[
        styles.container,
        hasConnected ? styles.connected : styles.disconnected,
      ]}>
      <GiftedChat
        messages={currentMessages || []}
        onSend={messages => sendMessage(messages)}
        showUserAvatar={false}
        renderAvatarOnTop={false}
        onPressAvatar={() => null}
        renderAvatar={null}
        showAvatarForEveryMessage={false}
        renderUsername={dd => dd.name}
        renderComposer={props => (
          <Composer {...props} textInputStyle={{color: '#000'}} />
        )}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: styles.bgLeft,
              right: styles.bgRight,
            }}
            tickStyle={{color: '#000', fontSize: 12}}
            textStyle={{
              left: styles.text,
              right: styles.text,
            }}
            renderTime={timeProps => (
              <Time
                {...timeProps}
                timeTextStyle={{
                  left: styles.text,
                  right: styles.text,
                }}
              />
            )}
          />
        )}
        user={{
          _id: 2,
          name: username,
        }}
      />
    </View>
  );
};

export default GiftedChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  connected: {
    backgroundColor: '#EFEFF4',
  },
  disconnected: {
    backgroundColor: '#EFE1E1',
  },
  text: {
    color: '#000',
  },
  textNotRead: {
    color: '#FFF',
  },
  bgRight: {
    backgroundColor: '#E1FEC6',
  },
  bgNotRead: {
    backgroundColor: '#808080',
  },
  bgLeft: {
    backgroundColor: '#FFFFFF',
  },
});
