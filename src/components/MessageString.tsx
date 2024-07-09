import React from 'react';
import {Text, StyleSheet} from 'react-native';

interface IProps {
  placeholder: string;
  error: boolean;
  errorText: string;
}

function MessageString({placeholder, error, errorText}: IProps) {
  const textColor = error ? '#FF5D54' : '#5c595973'; // Красный цвет для ошибки

  return (
    <Text style={[styles.label, {color: textColor}]}>
      {error ? errorText : placeholder}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default MessageString;
