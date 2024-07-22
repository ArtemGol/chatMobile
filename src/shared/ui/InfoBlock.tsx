import React, {ReactNode} from 'react';
import { Modal, View, Text, StyleSheet, ModalProps} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';


interface InfoBlockProps {
    children?: ReactNode;
    title?: string
}

const InfoBlock= (props: InfoBlockProps) => {
    const {
        children,
        title
    } = props;
    return (
        <View style={styles.infoBlock}>
            <View style={styles.title}>
                <Text>
                    {title}
                </Text>
            </View>
            <View style={styles.children}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoBlock: {
        // flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5
    },
    title: {
        marginBottom: 20,
        fontSize: 12,
        fontWeight: '400',
        color: '#00000033',
        alignItems: 'flex-start'
    },
    children: {
        marginBottom: 20,
        alignItems: 'center',
    },
});

export default InfoBlock;