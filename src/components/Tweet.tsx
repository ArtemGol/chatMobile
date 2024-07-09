import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface IProps {
  title: number;
}

const Tweet = ({}: IProps) => {
  const [lastMessage, setLastMessage] = useState('Начните переписку'); // Состояние для хранения текста последнего сообщения
  const {navigate} = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigate('Chat', {setLastMessage}); // Передача функции setLastMessage через параметры навигации
      }}
      style={[styles.contactPlug, {backgroundColor: '#ffffff'}]}>
      <View style={styles.icon}>
        <Text style={styles.iconText} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Никнейм</Text>
        <Text style={styles.statusText}>{lastMessage}</Text>
      </View>
      <View style={styles.borderRight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconText: {
    color: '#9a9a9a',
    fontSize: 25,
  },
  titleText: {
    fontSize: 17,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
  },
  contactPlug: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
  },
  borderRight: {
    position: 'absolute',
    bottom: 0,
    right: '0%',
    height: 1,
    width: '85%',
    backgroundColor: '#ccc',
  },
  statusText: {
    fontSize: 12,
  },
});

export default Tweet;
