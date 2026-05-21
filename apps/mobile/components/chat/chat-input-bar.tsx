import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<Props> = ({ onSend, placeholder = "Digite uma mensagem...", disabled }) => {
  const [text, setText] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View>
      <View style={{ ...styles.container, paddingBottom: Platform.OS === "ios" && !keyboardOpen ? 32 : 14 }}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#B0B0C6"
            multiline
            value={text}
            onChangeText={setText}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={disabled}
        >
          <Ionicons name="send" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: "#5A0000",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 22,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
