import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import type {IContact} from '../api/dto/IContacts.ts';

interface IProps {
  onPress: () => void;
  item: IContact;
}

const ContactPlug = ({onPress, item}: IProps) => {
  const statusText = item.channel ? 'подключен' : 'нет в сети';
  const statusColor = item.channel ? '#4F8EF7' : '#A9A9A9';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.contactPlug, {backgroundColor: '#ffffff'}]}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{item.name.slice(0, 1)}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{item.nickname}</Text>
        <Text style={[styles.statusText, {color: statusColor}]}>
          {statusText}
        </Text>
      </View>
      <View style={styles.borderRight} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
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
  iconText: {
    color: '#9a9a9a',
    fontSize: 25,
  },
  titleText: {
    color: '#000',
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
    height: 60,
  },
});

export default ContactPlug;
