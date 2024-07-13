import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProps {
    value?: string;
    onChangeText?: (text: string) => void;
}

const Search = ({ value, onChangeText }: IProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const widthAnim = useRef(new Animated.Value(0)).current;
    const cancelOpacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(cancelOpacityAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isFocused]);

    const inputWidth = widthAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '85%'], // Значения для анимации ширины инпута
    });

    const handleClick = () => {
        value = '';
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.wrapper, { width: inputWidth }]}>
                {!isFocused && value === '' && (
                    <View style={styles.placeholderWrapper}>
                        <Ionicons style={styles.icon} name="search-outline" size={15} />
                        <Text style={styles.placeholderText}>Поиск</Text>
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    {(isFocused || value !== '') && (
                        <Ionicons
                            style={[styles.icon, styles.leftIconFocused]}
                            name="search-outline"
                            size={15}
                        />
                    )}
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder=""
                    />
                    {isFocused && (
                        <TouchableOpacity onPress={() => onChangeText?.('')} style={styles.clearButton}>
                            <Ionicons style={styles.clearIcon} name="close-circle-outline" size={18} />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
            {isFocused && (
                <Animated.View style={{ opacity: cancelOpacityAnim }}>
                    <TouchableOpacity
                        onPress={() => {
                            inputRef.current?.blur();
                            setIsFocused(false);
                        }}
                        style={styles.cancelButton}>
                        <Text style={styles.cancelText}>Отмена</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    },
    wrapper: {
        position: 'relative',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30, // Добавлен отступ справа для иконки крестика
        height: 40,

        backgroundColor: '#EDEFF2',

        borderRadius: 8,
        padding: 10,
    },
    placeholderWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 12
    },
    icon: {
        color: '#BEBFC2',
        marginRight: 5,
        zIndex: 12
    },
    leftIconFocused: {
        position: 'absolute',
        left: 10,
        marginRight: 0, // Убираем отступ справа при фокусе
    },
    placeholderText: {
        color: '#181818', // Черный цвет для текста placeholder
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }], // Центрирование иконки по вертикали
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearIcon: {
        color: '#8E8F91', // Черный цвет для иконки крестика
    },
    cancelButton: {
        marginLeft: 5,
        marginRight: 12

    },
    cancelText: {
        color: '#00000066', // Черный цвет для текста отмены
        fontSize: 16,
    },
});

export default Search;
