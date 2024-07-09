import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

interface IProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

const ButtonLogin = ({onPress, title, disabled}: IProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled ? styles.disabledButton : styles.enabledButton,
      ]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: '#545659', // Активный цвет кнопки
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Цвет для отключенной кнопки
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default ButtonLogin;

// style={[styles.button, disabled ? styles.disabledButton : styles.enabledButton]}
