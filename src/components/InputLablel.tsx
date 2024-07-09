import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

interface IProps {
  label: string;
  placeholder: string;
}

const InputLabel = ({label, placeholder}: IProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#8e8e93"
    />
  </View>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 5,
    height: 14,
    paddingLeft: 7,
    zIndex: 100,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f2f2f7',
    fontSize: 16,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: '#f2f2f7',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default InputLabel;
