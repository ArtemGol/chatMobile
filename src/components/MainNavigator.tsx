import React, {useLayoutEffect} from 'react';
import Navigation from './Navigation.tsx';
import {NavigationContainer} from '@react-navigation/native';
import AuthScreen from '../screens/Auth.tsx';
import RegisterScreen from '../screens/Register.tsx';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {accessTokenSelector} from '../store/auth/authSelector.ts';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authAction, initialUserInfo} from '../store/auth/authSlice.ts';
import {IUserInfo} from '../api/dto/IAuth.ts';
import {store, useAppDispatch} from '../store';
import {IChannel} from '../api/dto/IChannel.ts';
import {channelAction} from '../store/channel/channelSlice.ts';
import {channelApi} from '../api/channelApi.ts';
import {IMessage} from 'react-native-gifted-chat';
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createNativeStackNavigator();

const getTokenAndUserDataFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const userData = JSON.parse(
      (await AsyncStorage.getItem('user_data')) || 'null',
    ) as IUserInfo;
    return {token: token || '', userData: userData || initialUserInfo};
  } catch (error) {
    return {token: '', userData: initialUserInfo};
  }
};

const getRoomsAndChannelsWithMessages = async () => {
  const rooms = await AsyncStorage.getItem('rooms');
  const channelsWithMessages = await AsyncStorage.getItem(
    'channelsWithMessages',
  );
  return {
    rooms: rooms ? (JSON.parse(rooms) as Record<string, string>) : {},
    channelsWithMessages: channelsWithMessages
      ? (JSON.parse(channelsWithMessages) as Record<string, IMessage[]>)
      : {},
  };
};


const getChannel = async (
  username: string,
  dispatch: typeof store.dispatch,
) => {
  const storageChannel = await AsyncStorage.getItem('channel');

  if (!storageChannel) {
    return (
      await dispatch(
        channelApi.endpoints.getChannelByNickName.initiate(username),
      )
    ).data as IChannel;
  }

  return (JSON.parse(storageChannel) as IChannel) || undefined;
};

export const MainNavigator = () => {
  const token = useSelector(accessTokenSelector);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    getRoomsAndChannelsWithMessages().then(res => {
      dispatch(channelAction.setRoomsAndChannelsWithMessages(res));
    });
    getTokenAndUserDataFromStorage().then(res => {
      getChannel(res.userData.username, dispatch).then(channelRes => {
        dispatch(channelAction.setChannel(channelRes));
      });
      dispatch(authAction.setUserData(res));
    });
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {token ? (
        <Navigation />
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={({navigation}) => ({
                  headerShadowVisible: false,
                  presentation: 'containedModal',
                  title: "Регистрация",
                  headerTitleAlign: 'center',
                  headerTitleStyle: {fontSize: 17, fontWeight: '500'},
                  headerStyle: {backgroundColor: '#F7F7F7',},
                  // eslint-disable-next-line react/no-unstable-nested-components
                  headerLeft: () => (
                      <TouchableOpacity
                          onPress={() => navigation.goBack()}
                          style={styles.backContainer}
                      >
                        <Ionicons
                            name="chevron-back-outline"
                            size={28}
                            color="#00000099"
                            // style={styles.iconRight}
                        />
                        <Text style={styles.text}>Вход</Text>
                      </TouchableOpacity>
                  ),
                })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconRight: {
    marginRight: 5,
  },
  backContainer:{
    flexDirection: 'row',
    gap: 0,
    alignItems: 'center',
    display: 'flex',
  },
  text:{
    fontWeight: '400',
    fontSize: 15,
  }
});
