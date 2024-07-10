import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonLogin from '../components/ButtonLogin'; // Импортируем кнопку "Добавить контакт"
import {Input} from "../components/Input.tsx";
import Button, {ButtonTheme, TextSize, TextTheme} from "../shared/ui/Button.tsx";

import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../assets/constants';

function AddContact() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactExists, setContactExists] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    const getJwtToken = async () => {

      try {
        const token = await AsyncStorage.getItem('user_data');
        if (token !== null) {
          const userData = JSON.parse(token);
          setJwtToken(userData.jwtToken);
        }
      } catch (error) {
        console.error('Error retrieving JWT token:', error);
      }
    };

    getJwtToken();
  }, []);

  const checkContact = async () => {

    if (nickname.trim() === '' && phoneNumber.trim() === '') {
      setContactExists(null);
      return;
    }

    let url: string | undefined;
    if (nickname.trim() !== '') {
      url = `${BASE_URL}/api/v1/user/username_exists?username=${nickname}`;
    } else if (phoneNumber.trim() !== '') {
      const formattedPhoneNumber = phoneNumber.replace('+', '');
      url = `${BASE_URL}/api/v1/user/phone_exists?phone=%2B${formattedPhoneNumber}`;
    }

    try {
      const response = await fetch(url || '', {
        method: 'GET',
        headers: {
          Authorization: `${jwtToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setContactExists(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addContact = async () => {
    const newContact = {
      name: nickname.trim(),
      phoneNumbers: phoneNumber.trim(),
      avaliable: nickname.trim(),
    };

    try {
      let contacts = (await AsyncStorage.getItem('@contacts')) as any;
      if (!contacts) {
        contacts = [];
      } else {
        contacts = JSON.parse(contacts);
      }
      contacts.unshift(newContact); // Добавляем новый контакт в начало массива
      await AsyncStorage.setItem('@contacts', JSON.stringify(contacts));
      await AsyncStorage.setItem('@contacts_refresh', 'true');
      let contacts2 = await AsyncStorage.getItem('@contacts');
      navigation.goBack(); // Возвращаемся назад после добавления контакта
      console.log(contacts2);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  useEffect(() => {
    checkContact();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname, phoneNumber, jwtToken]);

  const isButtonDisabled =
    !(nickname.trim() === '' && phoneNumber.trim() === '') &&
    contactExists === null;

  return (
    <View style={{backgroundColor: '#F7F7F7', flex: 1, alignItems: 'center'}}>
      <View style={{width: '90%', paddingTop: 60}}>
        {contactExists === true && (
            <View style={{ alignItems: 'center', marginBottom: 20}}>
              <View style={styles.round}>
                <Text style={styles.firstLetter}>{nickname.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
        )}
        <Input
            type={'labelUp'}
            placeholder={'никнейм'}
            innerPlaceholder={'Введите никнейм'}
            value={nickname}
            onChangeText={text => setNickname(text)}
        />
        <Input
            type={'labelUp'}
            placeholder={'номер телефона'}
            innerPlaceholder={'Введите номер телефона'}
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
        />
        {contactExists === true && (
            <>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbox-outline" size={24} />
                <Text style={styles.messageButtonText}>Сообщение</Text>
              </TouchableOpacity>
              <Button
                  title={'Добавить'}
                  onPress={addContact}
                  disabled={isButtonDisabled}
              />
            </>
        )}
        {contactExists === false && (
          <Text style={{color: '#0000004D'}}>Такой пользователь не найден</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  messageButton: {
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
  messageButtonText: {
    color: '#000000E5',
    fontSize: 16,
    paddingLeft: 10,
  },
  round:{
    backgroundColor: '#E4E4E4',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstLetter:{
    fontSize: 48,
    color: '#00000033'
  },
});

export default AddContact;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ButtonLogin from '../components/ButtonLogin';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

// function AddContact({ route }) {
//     const navigation = useNavigation();
//     const [nickname, setNickname] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [contactExists, setContactExists] = useState(null);
//     const [jwtToken, setJwtToken] = useState(null);
//     const [requestLog, setRequestLog] = useState([]);

//     useEffect(() => {
//         const getJwtToken = async () => {
//             try {
//                 const token = await AsyncStorage.getItem('user_data');
//                 if (token !== null) {
//                     const userData = JSON.parse(token);
//                     setJwtToken(userData.jwtToken);
//                 }
//             } catch (error) {
//                 console.error('Error retrieving JWT token:', error);
//             }
//         };

//         getJwtToken();
//     }, []);

//     const checkContact = async () => {
//         if (nickname.trim() === '' && phoneNumber.trim() === '') {
//             setContactExists(null);
//             return;
//         }

//         let url;
//         if (nickname.trim() !== '') {
//             url = `http://185.70.184.246:5010/api/v1/user/username_exists?username=${nickname}`;
//         } else if (phoneNumber.trim() !== '') {
//             const formattedPhoneNumber = phoneNumber.replace('+', '');
//             url = `http://185.70.184.246:5010/api/v1/user/phone_exists?phone=%2B${formattedPhoneNumber}`;
//         }

//         try {
//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `${jwtToken}`,
//                 },
//             });
//             const data = await response.json();
//             setRequestLog(prevLog => [
//                 ...prevLog,
//                 { url, status: response.status, response: data }
//             ]);
//             if (response.ok) {
//                 setContactExists(data);
//             } else {
//                 console.error(data.message);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     useEffect(() => {
//         checkContact();
//     }, [nickname, phoneNumber, jwtToken]);

//     const isButtonDisabled = !(nickname.trim() === '' && phoneNumber.trim() === '') && contactExists === null;

//     return (
//         <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center' }}>
//             <View style={{ width: '90%' }}>
//                 <View style={styles.section}>
//                     <Text style={styles.label}>никнейм</Text>
//                     <TextInput
//                         style={styles.content}
//                         placeholder="Введите никнейм"
//                         value={nickname}
//                         onChangeText={text => setNickname(text)}
//                     />
//                 </View>
//                 <View style={styles.section}>
//                     <Text style={styles.label}>номер телефона</Text>
//                     <TextInput
//                         style={styles.content}
//                         placeholder="Введите номер телефона"
//                         value={phoneNumber}
//                         onChangeText={text => setPhoneNumber(text)}
//                     />
//                 </View>
//                 {contactExists === true && (
//                     <>
//                         <ButtonLogin title={'Добавить контакт'} disabled={isButtonDisabled} />
//                         <TouchableOpacity style={styles.messageButton} onPress={() => navigation.navigate("ChangePassword")}>
//                             <Ionicons name='chatbox-outline' size={24} />
//                             <Text style={styles.messageButtonText}>Сообщение</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}
//                 {contactExists === false && (
//                     <Text style={{ color: 'red' }}>Контакт не найден</Text>
//                 )}
//                 <View style={{ marginTop: 20 }}>
//                     <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Лог запросов:</Text>
//                     {requestLog.map((log, index) => (
//                         <View key={index} style={{ marginBottom: 10 }}>
//                             <Text>Запрос {index + 1}:</Text>
//                             <Text>URL: {log.url}</Text>
//                             <Text>Статус: {log.status}</Text>
//                             <Text>Ответ: {JSON.stringify(log.response)}</Text>
//                         </View>
//                     ))}
//                 </View>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     section: {
//         width: '100%',
//         backgroundColor: '#F0F0F0',
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         borderRadius: 4,
//         marginBottom: 16,
//     },
//     label: {
//         fontSize: 12,
//         color: '#888',
//         marginBottom: 4,
//     },
//     content: {
//         fontSize: 16,
//         color: '#333',
//     },
//     messageButton: {
//         marginBottom: 7,
//         paddingLeft: 10,
//         color: '#000000A1',
//         width: '100%',
//         flexDirection: 'row',
//         backgroundColor: '#f0f0f0',
//         paddingVertical: 12,
//         borderRadius: 4,
//         alignItems: 'center',
//         alignSelf: 'flex-start',
//     },
//     messageButtonText: {
//         color: '#000000E5',
//         fontSize: 16,
//         paddingLeft: 10,
//     },
// });

// export default AddContact;
