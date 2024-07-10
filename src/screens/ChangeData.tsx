// ChangeData.js
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ButtonLogin from '../components/ButtonLogin';

import {useSelector} from 'react-redux';
import {userSelector} from '../store/auth/authSelector.ts';
import {Input} from '../components/Input.tsx';

import {InputDataChange} from "../shared/ui/InputDataChange.tsx";

import {validationFunk} from '../assets/utils/validationFunk.ts';
import {authApi} from '../api/authApi.ts';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../store';
import Button from "../shared/ui/Button.tsx";

const ChangeData = () => {
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation<any>();
  const userData = useSelector(userSelector);

  const [username, setUsername] = useState(userData.username);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);

  const [emailError, setEmailError] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const isDisable =
    phone === userData.phone &&
    email === userData.email &&
    username === userData.username;

  const handleChange = async () => {
    const emailVal = validationFunk({
      fieldName: 'Email',
      value: email,
      errors: ['required', 'email'],
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

    if (emailVal || nicknameVal || phoneVal) {
      setEmailError(emailVal);
      setNicknameError(nicknameVal);
      setPhoneError(phoneVal);
    } else {
      dispatch(
        authApi.endpoints.updateUser.initiate({phone, email, username}),
      ).then(res => {
        if (!res.error) {
          navigate('Profile');
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.insideBlock}>
        <InputDataChange
          placeholder={'никнейм'}
          error={nicknameError}
          type={'labelUp'}
          value={username}
          onChangeText={text => {
            setUsername(text);
            setNicknameError('');
          }}
        />
        <InputDataChange
          placeholder={'номер телефона'}
          comment={'Не обязательно для заполнения'}
          error={phoneError}
          type={'labelUp'}
          value={phone}
          onChangeText={text => {
            setPhone(text);
            setPhoneError('');
          }}
        />
        <InputDataChange
          placeholder={'email'}
          comment={'По email можно восстановить доступ к аккаунту.                      Не обязательно для заполнения'}
          error={emailError}
          type={'labelUp'}
          value={email}
          onChangeText={text => {
            setEmail(text);
            setEmailError('');
          }}
        />

        <Button
            title={'Изменить'}
            disabled={isDisable}
            onPress={handleChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  insideBlock: {
    width: '90%',
    paddingTop: 60,
  },
});

export default ChangeData;
