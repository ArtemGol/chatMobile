import {NavigationContainer, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  AppState,
  AppStateStatus,
  Linking,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import Profile from '../screens/Profile';
import ContactsScreen from '../screens/ContactsScreen';
import ChangePassword from '../screens/ChangePassword';
import ChangeData from '../screens/ChangeData';
import ChatDetails, {IncomingUser} from '../screens/GiftedChat.tsx';
import ChatPreview from '../screens/ChatPreview';
import ContactProfile from '../screens/ContactProfile';
import AddContact from '../screens/AddContact';
import GiftedChatScreen from '../screens/GiftedChat.tsx';
import ConfirmCode from '../screens/ConfirmCode.tsx';
import Security from '../screens/Security.tsx';
import * as io from 'socket.io-client';
import {BASE_CHANNEL_URL} from '../assets/constants';
import type {Socket} from 'socket.io-client';
import {IMessage} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import {userSelector} from '../store/auth/authSelector.ts';
import {
  channelSelector,
  currentRoomUserSelector,
  newMessagesSelector,
} from '../store/channel/channelSelector.ts';
import {useAppDispatch} from '../store';
import {channelAction} from '../store/channel/channelSlice.ts';
import {GiftedChatRightHeader} from './GiftedChatRightHeader.tsx';
import {contactsAction} from '../store/contacts/contactsSlice.ts';
import Contacts from 'react-native-contacts';
import {channelApi} from '../api/channelApi.ts';
import {contactsApi} from '../api/contactsApi.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {IContact} from '../api/dto/IContacts.ts';
import messaging from '@react-native-firebase/messaging';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function MessageStack() {
  return (
    <HomeStack.Navigator initialRouteName={'Create channel'}>
      <HomeStack.Screen
        name="Create channel"
        component={ChatPreview}
        options={{
          headerTitle: 'Чаты',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',

          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
        }}
      />
      <HomeStack.Screen
        name="Chat"
        component={ChatDetails}
        options={({navigation}) => ({
          presentation: 'containedModal',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"
                // style={styles.iconRight}
              />
              <Text style={styles.text}>Назад</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="GiftedChatScreen"
        component={GiftedChatScreen}
        options={({navigation, route}) => ({
          //@ts-ignore
          title: route.params?.userName,
          headerRight: () => <GiftedChatRightHeader isConnected />,
          presentation: 'containedModal',
          headerShadowVisible: true,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},

          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"
                // style={styles.iconRight}
              />
              <Text style={styles.text}>Чаты</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}

function ProfileStack() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
        }}
      />
      <HomeStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({navigation}) => ({
          headerTitle: 'Смена пароля',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"
                // style={styles.iconRight}
              />
              <Text style={styles.text}>Назад</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <HomeStack.Screen
        name="ConfirmCode"
        component={ConfirmCode}
        options={({navigation}) => ({
          headerTitle: 'Смена пароля',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"
                // style={styles.iconRight}
              />
              <Text style={styles.text}>Назад</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="Security"
        component={Security}
        options={({navigation}) => ({
          headerTitle: 'Безопасность',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"

                // style={styles.iconRight}
              />
              <Text style={styles.text}>Назад</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="ChangeData"
        component={ChangeData}
        options={({navigation}) => ({
          headerTitle: 'Изменить данные',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"
                // style={styles.iconRight}
              />
              <Text style={styles.text}>Назад</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}

function ContactStack() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={({navigation}) => ({
          title: 'Contacts',
          headerTitle: 'Контакты',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddContact')}>
              <Ionicons
                name="add-outline"
                size={28}
                color="#5075F6"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="ContactProfile"
        component={ContactProfile}
        options={({navigation}) => ({
          headerShadowVisible: false,
          presentation: 'containedModal',
          headerTitle: 'Контакт',
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"
                // style={styles.iconRight}
              />
              <Text style={styles.text}>Назад</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="AddContact"
        component={AddContact}
        options={({navigation}) => ({
          presentation: 'containedModal',
          headerShadowVisible: false,
          headerTitle: 'Добавить контакт',
          headerStyle: {backgroundColor: '#F7F7F7'},
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 17, fontWeight: '500'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backContainer}>
              <Ionicons
                name="chevron-back-outline"
                size={28}
                color="#00000099"
                // style={styles.iconRight}
              />
              <Text style={styles.text}>Назад</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}

function TabGroup() {
  const currentRoomUser = useSelector(currentRoomUserSelector);
  const navigation = useNavigation();
  const newMessage = Object.values(useSelector(newMessagesSelector)).reduce(
    (acc, val) => acc + val,
    0,
  );
  const [appState, setAppState] = useState(AppState.currentState);
  const dispatch = useAppDispatch();
  const {username} = useSelector(userSelector);
  const channel = useSelector(channelSelector);
  const socketRef = useRef<Socket | null>(null);
  const otherUser = useRef<string | null>(null);

  const connectionWithChannel = async () => {
    const connection = io.connect(BASE_CHANNEL_URL);
    socketRef.current = connection;
    dispatch(channelAction.setConnection(connection));
    socketRef.current.emit('join room', {
      roomID: channel?.ip,
      userName: username,
    });

    socketRef.current.on('other user', (user: IncomingUser) => {
      otherUser.current = user.id;
    });

    socketRef.current?.on('user joined', (user: IncomingUser) => {
      addSystemMessage(user.name, true);
      otherUser.current = user.id;
    });

    socketRef.current?.on('user left', (user: IncomingUser) => {
      addSystemMessage(user.name, false);
    });

    const addSystemMessage = (name: string, isConnected: boolean) => {
      const systemMessage: IMessage = {
        _id: Math.random().toString(),
        text: isConnected
          ? `${name} has joined the chat`
          : `${name} has left the chat`,
        createdAt: new Date(),
        system: true,
        user: {_id: 5},
      };
      if (name !== username) {
        dispatch(
          channelAction.setChannelsWithMessages({
            roomID: channel?.ip || '',
            port: name,
            message: systemMessage,
          }),
        );
      }
    };

    socketRef.current.on(
      'receive message',
      (data: {
        roomID: string;
        message: string;
        userName: string;
        id: string;
      }) => {
        if (data.userName === username) {
          return;
        }
        handleReceiveMessage(data);
      },
    );

    return () => {
      socketRef.current?.disconnect();
    };
  };

  const findExistingPhoneNumber = async (phoneNumbers: string[]) => {
    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      try {
        const name = await dispatch(
          contactsApi.endpoints.getContactNameByPhone.initiate(
            encodeURIComponent(phoneNumber),
          ),
        ).unwrap();
        if (name) {
          return name;
        }
      } catch (error) {
        console.error(`Ошибка проверки номера ${phoneNumber}:`, error);
        return null;
      }
    }
    return null;
  };

  const getContacts = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      },
    );
    const contactsResult = (await Contacts.getAll()) || [];
    const contactsFromPhone = contactsResult.map(contact => ({
      id: contact.recordID,
      name: contact.givenName,
      phoneNumbers: contact.phoneNumbers
        ? contact.phoneNumbers.map(phone => phone.number)
        : [],
      nickname: contact.displayName || contact.givenName || '',
      channel: null,
    }));

    // Создаем массив промисов
    const contactPromises = contactsFromPhone.map(async el => {
      const existName = await findExistingPhoneNumber(el.phoneNumbers);
      if (existName) {
        try {
          console.log('EXIST NAME', existName);
          const channelResult = await dispatch(
            channelApi.endpoints.getChannelByNickName.initiate(existName),
          ).unwrap();
          return {...el, channel: channelResult};
        } catch (error) {
          console.error('Error fetching channel:', error);
          return {...el, channel: null};
        }
      } else {
        return {...el, channel: null};
      }
    });

    // Ожидаем завершения всех промисов
    return await Promise.all(contactPromises);
  };

  useEffect(() => {
    if (channel) {
      connectionWithChannel();
    } else {
      socketRef.current?.disconnect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  useEffect(() => {
    getContactsFromStore().then(res => {
      if (!res) {
        getContacts().then(contactsRes => {
          if (contactsRes) {
            dispatch(contactsAction.setContacts(contactsRes));
          }
        });
      } else {
        dispatch(contactsAction.setContacts(res));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        if (currentRoomUser) {
          navigation.goBack();
        }
        connectionWithChannel();
      }

      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        socketRef.current?.emit('left room', {
          roomID: channel?.ip || '',
          userName: channel?.port || '',
        });
        socketRef.current?.disconnect();
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  const handleReceiveMessage = ({
    message,
    userName,
    roomID,
    id,
  }: {
    roomID: string;
    message: string;
    userName: string;
    id: string;
  }) => {
    const msg: IMessage = {
      _id: id,
      text: message,
      createdAt: new Date(),
      user: {
        _id: 3,
        name: userName,
      },
    };
    if (message) {
      socketRef.current?.emit('send message', {
        roomID: channel?.ip || roomID || '',
        message: '',
        userName: channel?.port || userName || '',
        id,
      });
      dispatch(channelAction.setNewMessages(userName));
    }
    dispatch(
      channelAction.setChannelsWithMessages({
        roomID: channel?.ip || roomID || '',
        port: userName,
        message: msg,
      }),
    );
  };
  return (
    <Tab.Navigator
      initialRouteName="Create"
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({color, focused, size}) => {
          let iconName;

          if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          }
          if (route.name === 'Create') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profiles') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Rooms') {
            iconName = focused ? 'enter' : 'enter-outline';
          }
          return <Ionicons name={iconName || ''} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#545659', // сюда закидывается цвет активного скрина на баре навигации
        tabBarInactiveTintColor: '#00000033', // тут цвет неактвной вкладки
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'white',
        },
      })}>
      <Tab.Screen
        name="Contacts"
        component={ContactStack}
        options={{headerShown: false, title: 'Контакты'}}
      />
      <Tab.Screen
        name="Create"
        component={MessageStack}
        options={{
          headerShown: false,
          title: 'Чаты',
          tabBarBadge: newMessage ? newMessage : undefined,
        }}
      />
      {/*<Tab.Screen name="Rooms" component={RoomsScreen} />*/}
      <Tab.Screen
        name="Profiles"
        component={ProfileStack}
        options={{headerShown: false, title: 'Профиль'}}
      />
    </Tab.Navigator>
  );
}

const getContactsFromStore = async () => {
  let currentContacts = JSON.parse(
    (await AsyncStorage.getItem('@contacts')) || '[]',
  ) as IContact[];
  if (!currentContacts.length) {
    return null;
  }
  return currentContacts;
};

const NAVIGATION_IDS = ['contacts', 'create', 'profiles'];

function buildDeepLinkFromNotificationData(data: any): string | null {
  const navigationId = data?.notificationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'create') {
    return 'myapp://create';
  }
  console.warn('Missing postId');
  return null;
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Create: 'create',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const foreground = messaging().onMessage(async remoteMessage => {
      console.log('Message received in foreground!', remoteMessage);
    });

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground();
    };
  },
};

const Navigation = () => {
  return (
    <NavigationContainer linking={linking}>
      <TabGroup />
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  iconRight: {
    marginRight: 5,
  },
  backContainer: {
    flexDirection: 'row',
    gap: 0,
    alignItems: 'center',
    display: 'flex',
  },
  text: {
    fontWeight: '400',
    fontSize: 15,
  },
});
