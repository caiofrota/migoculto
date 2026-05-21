import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  isMine: boolean;
  sender: string;
  isPrivate?: boolean;
}

interface Props {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<Props> = ({ message }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const containerStyle = [styles.container, message.isMine ? styles.containerMine : styles.containerOther];

  const bubbleStyle = [styles.bubble, message.isMine ? styles.bubbleMine : styles.bubbleOther];

  const textStyle = [styles.text, message.isMine ? styles.textMine : styles.textOther];

  return (
    <View style={containerStyle}>
      <View style={bubbleStyle}>
        {!message.isMine && (
          <Text style={styles.senderName} numberOfLines={1}>
            {message.sender}
          </Text>
        )}
        <Text style={textStyle}>{message.content}</Text>

        <View style={styles.meta}>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 2,
    flexDirection: "row",
  },
  containerMine: {
    justifyContent: "flex-end",
  },
  containerOther: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bubbleMine: {
    backgroundColor: "#2E7D32",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
  },
  textMine: {
    color: "#FFFFFF",
  },
  textOther: {
    color: "#EDEDF5",
  },
  senderName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FCE9B3",
    marginBottom: 2,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },
});
