import React from 'react';
import { Modal, View, Text, StyleSheet, ModalProps } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';

type ModalWin = ModalProps & {
    title?: string;
    children?: React.ReactNode;
    icon?: string;
    fullScreen?: boolean;
    backgroundColor?: BackgroundColor; // Используем enum
}

export enum BackgroundColor {
    WHITE = '#FFFFFF', // Белый
    GRAY = '#F7F7F7', // Серый

}

const ModalWindow: React.FC<ModalWin> = (props: ModalWin) => {
    const {
        title,
        children,
        icon,
        fullScreen = false,
        backgroundColor = BackgroundColor.WHITE, // Значение по умолчанию
        ...modalProps
    } = props;

    // Функция для преобразования enum в цвет
    const getBackgroundColor = (color: BackgroundColor) => {
        return color;
    };

    return (
        <Modal
            transparent={true}
            animationType='fade'
            {...modalProps}
        >
            <View style={styles.overlay}>
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={5}
                />
                <View style={[
                    styles.modalContainer,
                    fullScreen && styles.fullScreen,
                    { backgroundColor: getBackgroundColor(backgroundColor) } // Применяем цвет
                ]}>
                    {icon && (
                        <Ionicons style={styles.iconStyle} name={icon} size={40} />
                    )}
                    {title && <Text style={styles.title}>{title}</Text>}
                    <View style={styles.children}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    modalContainer: {
        width: 300,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        width: '100%',
        height: '100%',
        padding: 20,
        borderRadius: 0,
    },
    iconStyle: {
        color: '#5075F6',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
        paddingBottom: 12
    },
    children: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }
});

export default ModalWindow;
