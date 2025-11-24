import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface JoinGroupModalProps {
  visible: boolean;
  onClose: () => void;
  groupCode: string;
  password: string;
  onChangeGroupCode: (text: string) => void;
  onChangePassword: (text: string) => void;
  onConfirm: () => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  visible,
  onClose,
  groupCode,
  password,
  onChangeGroupCode,
  onChangePassword,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
              <View style={styles.box}>
                <Text style={styles.title}>Entrar em um grupo</Text>

                <Text style={styles.label}>Código do grupo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 12345"
                  placeholderTextColor="#aaa"
                  value={groupCode}
                  onChangeText={onChangeGroupCode}
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={onChangePassword}
                />

                <View style={styles.buttonsRow}>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                    <Text style={styles.confirmText}>Entrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
  },
  box: {
    backgroundColor: "#1a0a0a",
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  label: {
    color: "#FCE9B3",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 22,
    gap: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  cancelButton: {},
  cancelText: {
    color: "#FFB4A2",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#E53935",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
