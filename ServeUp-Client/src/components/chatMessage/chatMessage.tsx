// ChatMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './Styles';

interface ChatMessageProps {
  isSelf: boolean;
  message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ isSelf, message }) => {
  const containerStyle = isSelf ? styles.selfChatBar : styles.chatBar;

  return (
    <View style={containerStyle}>
      <Text>{message}</Text>
    </View>
  );
};


export default ChatMessage;