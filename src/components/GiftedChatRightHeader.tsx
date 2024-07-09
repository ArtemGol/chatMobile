import React from 'react';
import {Text, View} from 'react-native';

interface IProps {
  isConnected: boolean;
}

export const GiftedChatRightHeader = ({isConnected}: IProps) => {
  return (
    <View
      style={{
        maxWidth: 76,
        backgroundColor: isConnected ? '#EFEFF4' : '#F5A2A2',
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 100,
      }}>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'center',
          color: isConnected ? '#037EE5' : '#E50303',
        }}>
        {isConnected ? 'В P2P' : 'В обычный режим'}
      </Text>
    </View>
  );
};
