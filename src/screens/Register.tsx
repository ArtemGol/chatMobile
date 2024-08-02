import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input} from '../components/Input';
import Button from '../shared/ui/Button.tsx';
import {useRegisterMutation} from '../api/authApi.ts';
import {validationFunk} from '../assets/utils/validationFunk.ts';
import {useAppDispatch} from '../store';
import {channelApi} from '../api/channelApi.ts';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {deviceTokenSelector} from '../store/channel/channelSelector.ts';

const Register = () => {
  const deviceToken = useSelector(deviceTokenSelector);
  const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [pasError, setPasError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleRegister = async () => {
    const emailVal = validationFunk({
      fieldName: 'Email',
      value: email,
      errors: ['required', 'email'],
    });

    const pasVal = validationFunk({
      fieldName: 'Password',
      value: password,
      min: 6,
      errors: ['required', 'minLength'],
    });

    const nicknameVal = validationFunk({
      fieldName: 'Username',
      value: username,
      min: 6,
      errors: ['required', 'minLength'],
    });

    const phoneVal = validationFunk({
      fieldName: 'Phone',
      value: phone,
      min: 6,
      errors: ['required', 'minLength', 'phone'],
    });

    if (emailVal || pasVal || nicknameVal || phoneVal) {
      setEmailError(emailVal);
      setPasError(pasVal);
      setPhoneError(phoneVal);
      setNicknameError(nicknameVal);
    } else {
      try {
        const user = await register({
          username,
          phone,
          email,
          password,
        }).unwrap();
        await AsyncStorage.setItem('reg_response', JSON.stringify(user.result));
        const userName = user.requestParams.username;
        if (userName) {
          dispatch(
            channelApi.endpoints.addChannel.initiate({
              ip: deviceToken ?? '',
              port: userName,
            }),
          );
        }
      } catch (err) {
        console.error('Ошибка при регистрации:', err);
      }
    }
  };

  useEffect(() => {
    checkInputs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password, email, phone]);

  const checkInputs = () => {
    if (
      username.length > 0 &&
      password.length > 0 &&
      phone.length > 0 &&
      email.length > 0
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.insideBlock}>
        <Input
          type={'labelUp'}
          innerPlaceholder={'Придумайте ваш никнейм'}
          placeholder="никнейм"
          value={username}
          onChangeText={text => {
            setUsername(text);
            setNicknameError('');
          }}
          error={nicknameError}
        />

        <Input
          type={'labelUp'}
          placeholder="номер телефона"
          keyboardType="phone-pad"
          innerPlaceholder={'Введите номер телефона'}
          lowerCaption={'Не обязательно для заполнения'}
          value={phone}
          onChangeText={text => {
            setPhone(text);
            setPhoneError('');
          }}
          error={phoneError}
        />

        <Input
          type={'labelUp'}
          placeholder="email"
          lowerCaption={
            'По email можно восстановить доступ к аккаунту.                      Не обязательно для заполнения'
          }
          innerPlaceholder={'Введите email'}
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setEmailError('');
          }}
          error={emailError}
        />

        <Input
          type={'labelDown'}
          eye={true}
          innerPlaceholder={'Придумайте пароль'}
          value={password}
          onChangeText={text => {
            setPassword(text);
            setPasError('');
          }}
          error={pasError}
          secureTextEntry
        />
        <Button
          title={'Регистрация'}
          onPress={handleRegister}
          disabled={isButtonDisabled}
        />
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    height: '100%',
    alignItems: 'center',
  },
  insideBlock: {
    marginTop: 30,
    width: '90%',
  },
});
