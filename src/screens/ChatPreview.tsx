import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Linking, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  channelsMessagesSelector,
  newMessagesSelector,
} from '../store/channel/channelSelector.ts';
import {useGetChannelByNickNameQuery} from '../api/channelApi.ts';

import {useAppDispatch} from '../store';
import {channelAction} from '../store/channel/channelSlice.ts';

import ModalWindow, {BackgroundColor} from "../wighets/Modal.tsx";
import Search from "../shared/ui/Search.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../shared/ui/Button.tsx";
import QRCode from 'react-native-qrcode-svg';
import InfoBlock from "../shared/ui/InfoBlock.tsx";
import Ionicons from "react-native-vector-icons/Ionicons";


const DialogsScreen: React.FC = () => {
  const [name, setName] = useState('');
  const {data} = useGetChannelByNickNameQuery(name);
  const channelsMessages = useSelector(channelsMessagesSelector);
  const channels: string[] = Object.keys(channelsMessages);

  const channelsState = Array.from(
      new Set(data?.port === name ? [...channels, data?.port] : channels),
  ).filter(el => el?.toLowerCase().includes(name.toLowerCase()));

  const [regResponse, setRegResponse] = useState(null);
  const [showQRCode, setShowQRCode] = useState(true);
  const [showCodes, setShowCodes] = useState(false);

  const [link, setLink] = useState();
  const [code, setCode] = useState();

  useEffect(() => {
    const getRecoverData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('reg_response');
        if (storedData !== null) {
          console.log('Данные из AsyncStorage:', storedData);
          const parsedData = JSON.parse(storedData);
          const link = parsedData[1];
          const codes = parsedData[2];

          setLink(link);
          setCode(codes);
          console.log('Ссылка:', link);
          console.log('Коды:', codes);
          setRegResponse(link); // Устанавливаем данные в состояние
        } else {
          console.log('Данные в AsyncStorage отсутствуют');
          setRegResponse(null); // Очищаем состояние, если данных нет
        }
      } catch (error) {
        console.error('Ошибка при получении данных из AsyncStorage:', error);
      }
    };

    getRecoverData();
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
        <View style={{ paddingLeft: 10, paddingRight: 10}}>
          <Search
              value={name}
              onChangeText={setName}
          />
        </View>
        {regResponse && showQRCode && ( // Проверяем наличие данных в regResponse и показываем QR-код
            <ModalWindow
                title={'Привяжите аккаунт к Google authenticator для восстановления доступа'}
                fullScreen={true}
                visible={showQRCode}
                onRequestClose={() => setShowQRCode(false)}
                backgroundColor={BackgroundColor.GRAY}
            >
              <View style={{ width: '100%' }}>
                <InfoBlock title={'Google authenticator'}>
                  <QRCode value={link} />
                </InfoBlock>
              </View>

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

              <Button title={'Ок'} onPress={() => {setShowQRCode(false); setShowCodes(true);}} />
              <Text style={{ width: '100%', marginTop: 7 }}>
                Это всегда можно сделать в настройках безопасности
                в данных вашего профиля
              </Text>
            </ModalWindow>
        )}
        {regResponse && showCodes && ( // Проверяем наличие данных в regResponse и показываем резервные коды
            <ModalWindow
                title={'Сохраните резервные коды для восстановления доступа:'}
                fullScreen={true}
                visible={showCodes}
                onRequestClose={() => setShowCodes(false)}
                backgroundColor={BackgroundColor.GRAY}
            >
              <View style={{ width: '100%' }}>
                <InfoBlock title={'Резервные коды:'}>
                  {code && code.map((codeItem, index) => (
                      <Text style={{ fontSize: 17, padding: 2 }} key={index}>{codeItem}</Text>
                  ))}
                </InfoBlock>
              </View>
              <TouchableOpacity
                  style={styles.messageButton}

              >
                <Ionicons
                    style={styles.iconStyle}
                    name="copy-outline"
                    size={24}
                />
                <Text style={styles.messageButtonText}>Скопировать коды</Text>
              </TouchableOpacity>
              <Button title={'Ок'} onPress={() => setShowCodes(false)} />
              <Text style={{ width: '100%', marginTop: 7 }}>
                Это всегда можно сделать в настройках безопасности
                в данных вашего профиля
              </Text>
            </ModalWindow>
        )}
        <FlatList
            data={channelsState}
            renderItem={({item}) => <RoomItem name={item} />}
            keyExtractor={item => item.toString()}
        />
      </View>
  );
};

const RoomItem = ({name}: {name: string}) => {
  const dispatch = useAppDispatch();
  const newMessages = useSelector(newMessagesSelector)[name] || 0;
  const {data} = useGetChannelByNickNameQuery(name);
  const {navigate} = useNavigation<any>();

  const channelsMessages = useSelector(channelsMessagesSelector);
  const currentMessages = channelsMessages[name];
  const lastMessage = currentMessages?.[0];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Вc', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const day = daysOfWeek[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${hours}:${minutes}`;
  };

  return data?.ip ? (
      <TouchableOpacity
          onPress={() => {
            dispatch(channelAction.clearNewMessagesByName(name));
            navigate('GiftedChatScreen', {
              roomID: data.ip,
              userName: name,
              withoutConnection: true,
            });
          }}
          style={styles.itemContainer}>
        <View style={styles.round}>
          <Text style={{ fontSize: 30}}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.preview}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.lastMessage}>{lastMessage?.text || " "}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.date}>
            {lastMessage ? formatTime(lastMessage?.createdAt?.toString()) : " "}
          </Text>
          {newMessages > 0 && (
              <View style={styles.newMessages}>
                <Text style={styles.newMessagesAmount}>
                  {newMessages.toString()}
                </Text>
              </View>
          )}
        </View>

      </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#F7F7F7',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deleteButton: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
  },
  messageCountBlock: {
    marginLeft: 10,
    backgroundColor: '#FF0000',
    borderRadius: 100,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageCount: {
    color: '#FFF',
  },
  deleteButtonText: {
    color: '#000',
    fontSize: 14,
  },
  round: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#F3F3F3',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  lastMessage: {
    height: 40,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000E5',
  },
  preview: {
    width: '65%',
  },
  info: {
    height: '100%',
  },
  newMessages: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    borderRadius: 10,
    backgroundColor: '#5075F6',
    padding: 1,
    marginLeft: 38,
    marginTop: 12,
  },
  newMessagesAmount: {
    color: '#fff',
  },
  codes: {
    marginTop: 12,
    alignItems: 'center'
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

export default DialogsScreen;
