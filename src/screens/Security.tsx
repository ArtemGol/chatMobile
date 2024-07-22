import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoBlock from "../shared/ui/InfoBlock.tsx";
import QRCode from "react-native-qrcode-svg";
import Ionicons from "react-native-vector-icons/Ionicons";

function Security() {
    const [codes, setCodes] = useState(null);
    const [link, setLink] = useState(null);
    const route = useRoute();

    useEffect(() => {
        const getRecoveryData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('reg_response');
                if (storedData !== null) {
                    console.log('Данные из AsyncStorage:', storedData);
                    const parsedData = JSON.parse(storedData);
                    const link = parsedData[1];
                    const codes = parsedData[2];

                    setLink(link);
                    setCodes(codes);
                    console.log('Ссылка:', link);
                    console.log('Коды:', codes);
                } else {
                    console.log('Данные в AsyncStorage отсутствуют');
                }
            } catch (error) {
                console.error('Ошибка при получении данных из AsyncStorage:', error);
            }
        };

        getRecoveryData();
    }, []);



    const handleOpenLink = async () => {
        if (link) {
            const supported = await Linking.canOpenURL(link);

            if (supported) {
                Linking.openURL(link).catch(err => console.error('Ошибка при открытии ссылки:', err));
            } else {
                Alert.alert(
                    "Не удалось открыть ссылку",
                    "Пожалуйста, установите приложение Google Authenticator и попробуйте снова.",
                    [{ text: "OK" }]
                );
            }
        }
    };

    return (
        <View style={styles.container}>
            {link && codes && (
                <>
                    <Text style={styles.mb}>
                        Привяжите аккаунт к Google authenticator
                        или сохраните резервные коды для восстановления аккаунта
                    </Text>
                    <InfoBlock title={'Google authenticator'}>
                        <QRCode value={link} />
                    </InfoBlock>
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={handleOpenLink}
                    >
                        <Ionicons
                            style={styles.iconStyle}
                            name="link-outline"
                            size={24}
                        />
                        <Text style={styles.messageButtonText}>Перейти в Google authenticator</Text>
                    </TouchableOpacity>
                    {/*<InfoBlock title={'Резервные коды'}>*/}
                    {/*    <Text>*/}
                    {/*        {codes.join('\n')}*/}
                    {/*    </Text>*/}
                    {/*</InfoBlock>*/}
                    {/*<TouchableOpacity*/}
                    {/*    style={styles.messageButton}*/}
                    {/*    onPress={handleCopyCodes}*/}
                    {/*>*/}
                    {/*    <Ionicons*/}
                    {/*        style={styles.iconStyle}*/}
                    {/*        name="copy-outline"*/}
                    {/*        size={24}*/}
                    {/*    />*/}
                    {/*    <Text style={styles.messageButtonText}>Скопировать коды</Text>*/}
                    {/*</TouchableOpacity>*/}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#F7F7F7',
        paddingLeft: 20,
        paddingRight: 20,
    },
    mb: {
        marginBottom: 10,
    },
    messageButton: {
        marginTop: 10,
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
    iconStyle: {
        color: '#000',
    },
    messageButtonText: {
        color: '#000000E5',
        fontSize: 16,
        paddingLeft: 10,
    },
});

export default Security;
