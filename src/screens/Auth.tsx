import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ButtonLogin from '../components/ButtonLogin';
import {Input} from '../components/Input.tsx';
import {useLoginAndFetchUserMutation} from '../api/authApi.ts';
import {validationFunk} from '../assets/utils/validationFunk.ts';
import {channelApi} from '../api/channelApi.ts';
import {useAppDispatch} from '../store';
import {channelAction} from '../store/channel/channelSlice.ts';
import {generateID} from '../assets/constants/generatedId.ts';

import Button, {ButtonTheme} from "../shared/ui/Button.tsx";

const AuthScreen = () => {
  const dispatch = useAppDispatch();
  const [login] = useLoginAndFetchUserMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [pasError, setPasError] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string>('');

  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    const nicknameVal = validationFunk({
      fieldName: 'Username',
      value: username,
      errors: ['required'],
    });

    const pasVal = validationFunk({
      fieldName: 'Password',
      value: password,
      errors: ['required'],
    });

    if (pasVal || nicknameVal) {
      setPasError(pasVal);
      setNicknameError(nicknameVal);
    } else {
      const user = await login({username, password}).unwrap();
      const userName = user.userInfo.username;
      if (userName) {
        const existChannel = await dispatch(
          channelApi.endpoints.getChannelByNickName.initiate(userName),
        );
        if (!existChannel.data?.ip) {
          dispatch(
            channelApi.endpoints.addChannel.initiate({
              ip: generateID(),
              port: userName,
            }),
          );
        } else {
          dispatch(channelAction.setChannel(existChannel.data));
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.insideBlock}>
          <Input
            type={'labelDown'}
            placeholder="Username"
            value={username}
            onChangeText={text => {
              setUsername(text);
              setNicknameError('');
            }}
            error={nicknameError}
          />
          <Input
            type={'labelDown'}
            placeholder="Password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasError('');
            }}
            error={pasError}
            secureTextEntry
          />
        </View>

        <ButtonLogin onPress={handleLogin} title={'Login'} />
        <Button title={"title"} theme={ButtonTheme.OUTLINE_RED}/>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Отображение отправленных и полученных данных */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 330,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  formContainer: {
    alignContent: 'center',
    width: '85%',
  },
  insideBlock: {
    width: '100%',
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  registerText: {
    color: '#000',
  },
});

export default AuthScreen;
