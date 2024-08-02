import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Input} from '../components/Input.tsx';
import {useLoginAndFetchUserMutation} from '../api/authApi.ts';
import {validationFunk} from '../assets/utils/validationFunk.ts';
import {channelApi} from '../api/channelApi.ts';
import {useAppDispatch} from '../store';
import {channelAction} from '../store/channel/channelSlice.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button, {
  ButtonTheme,
  TextSize,
  TextTheme,
} from '../shared/ui/Button.tsx';
import {useSelector} from 'react-redux';
import {deviceTokenSelector} from '../store/channel/channelSelector.ts';

const AuthScreen = () => {
  const deviceToken = useSelector(deviceTokenSelector);
  const dispatch = useAppDispatch();
  const [login] = useLoginAndFetchUserMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [pasError, setPasError] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
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
        if (!existChannel.data?.ip || deviceToken !== existChannel.data?.ip) {
          dispatch(
            channelApi.endpoints.addChannel.initiate({
              ip: deviceToken ?? '',
              port: userName,
            }),
          );
        } else {
          dispatch(channelAction.setChannel(existChannel.data));
        }
      }
    }
  };

  useEffect(() => {
    checkInputs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  const checkInputs = () => {
    if (username.length > 0 && password.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.insideBlock}>
          <View style={styles.logoContainer}>
            <Ionicons style={styles.logo} name="chatbubble-outline" size={20} />
            <Text style={styles.logoText}>Tet a tet</Text>
          </View>
          <Input
            type={'labelDown'}
            innerPlaceholder={'Ваш никнейм'}
            value={username}
            onChangeText={text => {
              setUsername(text);
              setNicknameError('');
            }}
            error={nicknameError}
          />
          <Input
            type={'labelDown'}
            innerPlaceholder={'Пароль'}
            eye={true}
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasError('');
            }}
            error={pasError}
            secureTextEntry
          />
        </View>
        <View style={styles.downContainer}>
          <Button
            title={'Войти'}
            theme={ButtonTheme.BASE}
            onPress={handleLogin}
            disabled={isButtonDisabled}
          />
          <Text style={styles.text}>Еще нет в tet a tet?</Text>

          <Button
            title={'Создать аккаунт'}
            theme={ButtonTheme.CREATE}
            textTheme={TextTheme.DARK}
            textSize={TextSize.S}
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>

      {/* Отображение отправленных и полученных данных */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 230,
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  formContainer: {
    alignContent: 'center',
    width: '85%',
  },
  insideBlock: {
    width: '100%',
    marginBottom: 0,
  },
  registerButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  registerText: {
    color: '#000',
  },
  text: {
    color: '#8C8C8C',
    fontSize: 15,
    marginTop: 80,
  },
  downContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    color: '#545659',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default AuthScreen;
