// Profile.js
import React, {useCallback, useEffect, useRef, useState} from 'react';
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

import ModalWindow from "../wighets/Modal.tsx";

import Search from "../shared/ui/Search.tsx";

function Profile() {
  const {username, phone, email} = useSelector(userSelector);
  const connection = useSelector(connectionSelector);
  const dispatch = useAppDispatch();
  const [changes, setChanges] = useState(false);
  const navigation = useNavigation<any>();
  const socketRef = useRef<Socket | null>(connection);

  const [showModal, setShowModal] = useState(false)

  const handleLogout = () => {
    dispatch(channelAction.clearChannelsWithMessages());
    dispatch(authAction.logout());
    socketRef.current?.disconnect();
    AsyncStorage.clear();
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    if (/^\+7\d{10}$/.test(phoneNumber)) {
      return phoneNumber.replace(/(\+\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phoneNumber;
  };


  return (
    <View style={styles.container}>
      <View style={styles.innercontainer}>
        <View style={styles.round}>
          <Text style={styles.firstLetter}>{username.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.dataBlock}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.phone}>{formatPhoneNumber(phone)}</Text>
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
        <TouchableOpacity style={styles.messageButton} onPress={() => setShowModal(true)}>
          <Ionicons style={styles.iconStyle} name="exit-outline" size={24} />
          <Text style={styles.messageButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      {showModal && (
          <ModalWindow title={'Выйти из аккаунта?'}>
            <Button
                title={'Выход'}
                theme={ButtonTheme.LOGOUT}
                textTheme={TextTheme.ERROR}
                textSize={TextSize.S}
                onPress={handleLogout}
            />
            <Button
                title={'Отмена'}
                textSize={TextSize.S}
                onPress={() => setShowModal(false)}
            />
          </ModalWindow>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    color: '#000',
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
  dataBlock:{
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 40
  },
  username: {
    fontSize: 26,
    color: '#000000E5',
    fontWeight: '500'
  },
  phone: {
    color: '#8E8E93',
    fontSize: 16
  },

  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: 20,
  },
  innercontainer: {
    alignItems: 'center',
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
    marginBottom: 10,
    paddingLeft: 10,
    color: '#000000A1',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
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
