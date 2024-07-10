import React from 'react';
import { Modal, View, Text, StyleSheet, ModalProps} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';


type ModalWin = ModalProps & {
    title?: string;
    children?: React.ReactNode;
    icon?: string;
}

const ModalWindow: React.FC<ModalWin> = ({ title, children, icon, onClose, ...props }) => {
    return (
        <Modal
            transparent={true}
            animationType='fade'
            {...props}
        >
            <View style={styles.overlay}>
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={5}
                />
                <View style={styles.modalContainer}>
                    {icon && (
                        <Ionicons style={styles.iconStyle} name={icon} size={24} />
                    )}
                    {title && <Text style={styles.title}>{title}</Text>}
                    {children}
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
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        color: '#5075F6',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default ModalWindow;