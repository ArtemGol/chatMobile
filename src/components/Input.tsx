import React, {useState} from 'react';
import {TextInput, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";


interface IProps {
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    type: 'labelUp' | 'labelDown';
    innerPlaceholder?: string;
    eye?: boolean;
    lowerCaption?: string
}

export const Input = ({
                          keyboardType = 'default',
                          placeholder,
                          innerPlaceholder,
                          value,
                          onChangeText,
                          secureTextEntry = false,
                          error,
                          lowerCaption,
                          type,
                          eye = false,
                      }: IProps) => {
    const textColor = error ? '#FF5D54' : '#5c595973';
    const isLabelUp = type === 'labelUp';

    const [isPassword, setIsPassword] = useState(eye ? true : secureTextEntry);

    const toggleVisiable = () => {
        setIsPassword(prev => !prev);
    };

    return type === 'labelUp' ? (
        <View>
            <View style={[styles.container, error ? styles.error : styles.marginBottom16]}>
                <Text style={styles.labelUp}>{placeholder}</Text>
                <TextInput
                    style={styles.inputUp}
                    value={value}
                    placeholder={innerPlaceholder}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                />
            </View>

            {/*{!!error && (*/}
            {/*    <Text style={[styles.labelDown, styles.marginBottom8, { color: textColor }]}>*/}
            {/*        {error ? error : placeholder}*/}
            {/*    </Text>*/}
            {/*)}*/}
            {!!error ? (
                <Text style={[styles.labelDown, styles.marginBottom8, { color: textColor }]}>
                    {error}
                </Text>
            ) : (
                <Text style={[styles.penis, { color: textColor }]}>
                    {lowerCaption}
                </Text>
            )}
        </View>
    ) : (
        <>
            {isLabelUp && <Text style={styles.labelUp}>{placeholder}</Text>}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={innerPlaceholder}
                    style={[styles.inputDown, !!error && styles.error]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPassword}
                    keyboardType={keyboardType}
                />
                {eye && (
                    <TouchableOpacity style={styles.toggle} onPress={toggleVisiable}>
                        <Ionicons
                            style={styles.iconStyle}
                            name={isPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={24}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {!!error ? (
                <Text style={[styles.labelDownError, styles.marginBottom8, { color: textColor }]}>
                    {error}
                </Text>
            ) : (
                <Text style={[styles.penis2, { color: textColor }]}>
                    {lowerCaption}
                </Text>
            )}




            {/*<Text style={[styles.labelDown, { color: textColor }]}>*/}
            {/*    {error ? error : lowerCaption}*/}
            {/*</Text>*/}
        </>
    );
};

const styles = StyleSheet.create({

    penis:{
        marginTop: -11,
        marginBottom: 8,
        fontSize: 12,
    },
    penis2:{
        marginTop: 10,
        fontSize: 12,
    },
  container: {
    width: '100%',
    backgroundColor: '#EDEFF2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,


  },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EDEFF2',
        height: 30,
        borderRadius: 10
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
      paddingLeft: -5,
    color: '#00000033',
    fontSize: 16,
    marginTop: -10,
    marginBottom: -10
  },
  labelUp: {
    fontSize: 12,
    color: '#888',
    marginBottom: -5,
  },
  labelDown: {
    marginTop: 3,
    fontSize: 12,
  },
    labelDownError: {
        marginTop: 12,
        fontSize: 12,
    },
  error: {
    borderWidth: 1,
    borderColor: 'red',
  },
    iconStyle: {
        color: '#000',
        opacity: 0.2
    },
    toggle:{
      marginTop: 8,
      marginLeft: -35,

    }
});
