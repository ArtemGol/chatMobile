import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {Input} from '../components/Input';
import {validationFunk} from '../assets/utils/validationFunk.ts';
import {useAppDispatch} from '../store';
import {authApi} from '../api/authApi.ts';

import Button, {ButtonTheme, TextSize, TextTheme} from "../shared/ui/Button.tsx";
import {useNavigation} from "@react-navigation/native";

function ChangePassword() {
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [oldError, setOldError] = useState<string>('');
  const [newError, setNewError] = useState<string>('');
  const [repeatError, setRepeatError] = useState<string>('');

    const {navigate} = useNavigation<any>();

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
        navigate('ConfirmCode', {
            oldPassword: oldPassword,
            newPassword: newPassword
        });

      // TODO: Change password
    }
  };

    const checkInputs = () => {
        if (oldPassword.length > 0 &&
            newPassword.length > 0 &&
            repeatPassword.length > 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    };


    useEffect(() => {
        checkInputs();
    }, [oldPassword, newPassword, repeatPassword]);

  return (
    <View style={styles.container}>
      <Input
        innerPlaceholder={'Введите текущий пароль'}
        error={oldError}
        eye={true}
        type={'labelDown'}
        value={oldPassword}
        onChangeText={text => {
          setOldPassword(text);
          setOldError('');
        }}
      />
        <View style={styles.mt}>
            <Input
                innerPlaceholder={'Придумайте новый пароль'}
                error={newError}
                eye={true}
                type={'labelDown'}
                value={newPassword}
                onChangeText={text => {
                    setNewPassword(text);
                    setNewError('');
                }}

            />
            <Input
                innerPlaceholder={'Повторите новый пароль'}
                error={repeatError}
                eye={true}
                type={'labelDown'}
                value={repeatPassword}
                onChangeText={text => {
                    setRepeatPassword(text);
                    setRepeatError('');
                }}
            />
        </View>
        <Button title={'Изменить пароль'} onPress={handleChange} disabled={isButtonDisabled}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    backgroundColor: '#F7F7F7',
    paddingLeft: 20,
    paddingRight: 20,
  },
    mt:{
      marginTop: 10
    }
});

export default ChangePassword;
