import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Input } from '../components/Input';
import { useAppDispatch } from '../store';
import { authApi } from '../api/authApi.ts';

function ConfirmCode() {
    const [code, setCode] = useState('');

    const route = useRoute<any>();
    const dispatch = useAppDispatch();

    const oldPassword = route.params?.oldPassword;
    const newPassword = route.params?.newPassword;

    const handleChange = (value: string) => {
        setCode(value);

        // Проверка на 6 цифр
        if (/^\d{6}$/.test(value)) {
            processInput('google ' + value, oldPassword, newPassword);
        }
        // Проверка на образец
        else if (/^[a-zA-Z0-9_-]{22}$/.test(value)) {
            processInput('recovery ' + value, oldPassword, newPassword);
        }
    };

    const processInput = async (processedValue: string, oldPassword: string, newPassword: string) => {
        console.log(processedValue);
        try {
            const changePassword = await dispatch(
                authApi.endpoints.updatePassword.initiate({ old_password: oldPassword, new_password: newPassword, code })
            ).unwrap();
            console.log('Password changed successfully:', changePassword);
        } catch (error) {
            console.error('Failed to change password:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.mb}>
                <Input
                    type={'labelDown'}
                    innerPlaceholder={'Введите код подтверждения'}
                    lowerCaption={'Введите один из кодов восстановления или воспользуйтесь кодом от Google'}
                    onChangeText={handleChange}
                    value={code}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 250,
        backgroundColor: '#F7F7F7',
        paddingLeft: 20,
        paddingRight: 20,
    },
    mb: {
        marginBottom: 10,
    },
});

export default ConfirmCode;
