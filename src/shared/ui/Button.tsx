import React, { memo } from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { classNames, Mods } from '../lib/classNames';

export enum ButtonTheme {
    BASE = 'base',
    LOGOUT = 'logout',
    CREATE = 'create',
}

export enum TextTheme {
    BASE = 'base',
    ERROR = 'error',
    DARK = 'dark'
}

export enum TextSize {
    S = 's',
    M = 'm'
}


interface ButtonProps {
    onPress?: () => void;
    title: string;
    className?: Record<string, any>;
    theme?: ButtonTheme;
    disabled?: boolean;
    textTheme?: TextTheme
    textSize?: TextSize
}

const Button: React.FC<ButtonProps> = memo((props: ButtonProps) => {
    const {
        onPress,
        title,
        className,
        theme = ButtonTheme.BASE,
        disabled,
        textTheme = TextTheme.BASE,
        textSize = TextSize.M,
        ...otherProps
    } = props;

    const modsButton: Mods = {
        [theme]: true,
        disabled: disabled,
    };

    const modsText: Mods = {
        [textTheme]: true,
        [textSize]: true
    };

    const buttonStyles: ViewStyle = classNames(buttonStyle.button, modsButton, [], buttonStyle);
    const textStyles: ViewStyle = classNames(textStyle.text, modsText, [], textStyle);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={buttonStyles}
            {...otherProps}
        >
            <Text style={textStyles}>{title}</Text>
        </TouchableOpacity>
    );
});

const buttonStyle = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    base: {
        backgroundColor: '#545659',
    } as ViewStyle,
    logout: {
        backgroundColor: '#5456590F',
    } as ViewStyle,
    create: {
        backgroundColor: '#FFFFFF',
        width: 200,
    } as ViewStyle,
    disabled: {
        backgroundColor: '#5456591A',
    } as ViewStyle,
});

const textStyle = StyleSheet.create({
    text: {

    } as TextStyle,
    base: {
        color: '#FFFFFF'
    } as TextStyle,
    dark: {
        color: '#000000E5',
    } as TextStyle,
    error: {
        color: '#FF5D54',
        fontWeight: "500"
    } as TextStyle,
    s: {
        fontSize: 15
    } as TextStyle,
    m: {
        fontSize: 17
    } as TextStyle,
});

export default Button;

