import React from 'react';
import { Modal, View, Text, StyleSheet, ModalProps} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';


interface FindProps {
    onClick: () => void;
}

const Find= (props: FindProps) => {
    const {
        onClick,
    } = props;
    return (
        <View></View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
});

export default Find;