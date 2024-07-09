// Profile.js
import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch} from '../store';
import {authAction} from '../store/auth/authSlice.ts';
import {useSelector} from 'react-redux';
import {userSelector} from '../store/auth/authSelector.ts';
import {channelAction} from '../store/channel/channelSlice.ts';
import {connectionSelector} from '../store/channel/channelSelector.ts';
import type {Socket} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button, {ButtonTheme, TextSize, TextTheme} from "../shared/ui/Button.tsx";

function Profile() {
  const {username, phone, email} = useSelector(userSelector);
  const connection = useSelector(connectionSelector);
  const dispatch = useAppDispatch();
  const [changes, setChanges] = useState(false);
  const navigation = useNavigation<any>();
  const socketRef = useRef<Socket | null>(connection);

  const handleLogout = () => {
    dispatch(channelAction.clearChannelsWithMessages());
    dispatch(authAction.logout());
    socketRef.current?.disconnect();
    AsyncStorage.clear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.innercontainer}>
        <Text style={styles.mainheader}>{username}</Text>
        <Text style={styles.status}>в сети</Text>
        <View style={styles.section}>
          <Text style={styles.label}>никнейм</Text>
          <Text style={styles.content}>{username}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>номер телефона</Text>
          <Text style={styles.content}>{phone}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>email</Text>
          <Text style={styles.content}>{email}</Text>
        </View>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() =>
            navigation.navigate('ChangeData', {setChanges, changes})
          }>
          <Ionicons
            style={styles.iconStyle}
            name="analytics-outline"
            size={24}
          />
          <Text style={styles.messageButtonText}>изменить данные</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => navigation.navigate('ChangePassword')}>
          <Ionicons
            style={styles.iconStyle}
            name="lock-closed-outline"
            size={24}
          />
          <Text style={styles.messageButtonText}>изменить пароль</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton} onPress={handleLogout}>
          <Ionicons style={styles.iconStyle} name="exit-outline" size={24} />
          <Text style={styles.messageButtonText}>Выйти</Text>
        </TouchableOpacity>
        <Button
            title={"Добавить"}
            theme={ButtonTheme.CREATE}
            disabled={false}
            textTheme={TextTheme.DARK}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 100,
  },
  innercontainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  mainheader: {
    color: '#000',
    textAlign: 'center',
    fontSize: 30,
    paddingBottom: 10,
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
    marginBottom: 7,
    paddingLeft: 10,
    color: '#000000A1',
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

export default Profile;
