import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ButtonLogin from '../components/ButtonLogin';
import {Input} from '../components/Input';
import {validationFunk} from '../assets/utils/validationFunk.ts';
import {useAppDispatch} from '../store';
import {authApi} from '../api/authApi.ts';

function ChangePassword() {
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [oldError, setOldError] = useState<string>('');
  const [newError, setNewError] = useState<string>('');
  const [repeatError, setRepeatError] = useState<string>('');

  const handleChange = () => {
    const oldPasVal = validationFunk({
      fieldName: 'Old password',
      value: oldPassword,
      min: 6,
      errors: ['required', 'minLength'],
    });

    const newPasVal = validationFunk({
      fieldName: 'New password',
      value: newPassword,
      min: 6,
      errors: ['required', 'minLength'],
    });

    const repeatPasVal = validationFunk({
      fieldName: 'Repeat password',
      value: repeatPassword,
      confirmPas: newPassword,
      min: 6,
      errors: ['required', 'minLength', 'confirm'],
    });

    if (oldPasVal || newPasVal || repeatPasVal) {
      setOldError(oldPasVal);
      setNewError(newPasVal);
      setRepeatError(repeatPasVal);
    } else {
      dispatch(
        authApi.endpoints.updatePassword.initiate({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      );
      // TODO: Change password
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder={'old password'}
        error={oldError}
        type={'labelUp'}
        value={oldPassword}
        onChangeText={text => {
          setOldPassword(text);
          setOldError('');
        }}
      />
      <Input
        placeholder={'new password'}
        error={newError}
        type={'labelUp'}
        value={newPassword}
        onChangeText={text => {
          setNewPassword(text);
          setNewError('');
        }}
      />
      <Input
        placeholder={'repeat password'}
        error={repeatError}
        type={'labelUp'}
        value={repeatPassword}
        onChangeText={text => {
          setRepeatPassword(text);
          setRepeatError('');
        }}
      />
      <ButtonLogin title={'Изменить пароль'} onPress={handleChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default ChangePassword;
