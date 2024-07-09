import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input} from '../components/Input';
import ButtonLogin from '../components/ButtonLogin';
import {useRegisterMutation} from '../api/authApi.ts';
import {validationFunk} from '../assets/utils/validationFunk.ts';
import {useAppDispatch} from '../store';
import {channelApi} from '../api/channelApi.ts';
import {generateID} from '../assets/constants/generatedId.ts';

const Register = () => {
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
      const user = await register({username, phone, email, password}).unwrap();
      const userName = user.requestParams.username;
      if (userName) {
        dispatch(
          channelApi.endpoints.addChannel.initiate({
            ip: generateID(),
            port: userName,
          }),
        );
      }
    }
  };

  return (
    <View style={styles.container}>
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
          placeholder="Phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={text => {
            setPhone(text);
            setPhoneError('');
          }}
          error={phoneError}
        />

        <Input
          type={'labelDown'}
          placeholder="Email"
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
          placeholder="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            setPasError('');
          }}
          error={pasError}
          secureTextEntry
        />

        <ButtonLogin onPress={handleRegister} title={'Register'} />
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    height: '100%',
    alignItems: 'center',
  },
  insideBlock: {
    width: '90%',
  },
});
