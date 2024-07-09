import React from 'react';
import {TextInput, StyleSheet, Text, View} from 'react-native';

interface IProps {
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  type: 'labelUp' | 'labelDown';
}

export const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  type,
}: IProps) => {
  const textColor = error ? '#FF5D54' : '#5c595973';
  const isLabelUp = type === 'labelUp';
  return type === 'labelUp' ? (
    <>
      <View
        style={[
          styles.container,
          error ? styles.error : styles.marginBottom16,
        ]}>
        <Text style={styles.labelUp}>{placeholder}</Text>
        <TextInput
          style={styles.inputUp}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
      {!!error && (
        <Text
          style={[styles.labelDown, styles.marginBottom8, {color: textColor}]}>
          {error ? error : placeholder}
        </Text>
      )}
    </>
  ) : (
    <>
      {isLabelUp && <Text style={styles.labelUp}>{placeholder}</Text>}
      <TextInput
        style={[styles.inputDown, !!error && styles.error]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      <Text style={[styles.labelDown, {color: textColor}]}>
        {error ? error : placeholder}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  marginBottom16: {
    marginBottom: 16,
  },
  marginBottom8: {
    marginBottom: 8,
  },
  inputDown: {
    color: '#000000',
    height: 40,
    width: '100%',
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#edeff2',
    marginTop: 10,
  },
  inputUp: {
    color: '#000000',
    fontSize: 16,
  },
  labelUp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  labelDown: {
    marginTop: 5,
    fontSize: 12,
  },
  error: {
    borderWidth: 1,
    borderColor: 'red',
  },
});
