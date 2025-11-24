import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface AddGroupActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onJoinExisting: () => void;
  onScanCode: () => void;
}

export const AddGroupActionSheet: React.FC<AddGroupActionSheetProps> = ({ visible, onClose, onCreateNew, onJoinExisting, onScanCode }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>Adicionar grupo</Text>

              <TouchableOpacity style={styles.option} onPress={onCreateNew}>
                <Ionicons name="create-outline" size={22} color="#FFE6D5" />
                <View style={styles.optionTextWrapper}>
                  <Text style={styles.optionTitle}>Criar grupo do zero</Text>
                  <Text style={styles.optionSubtitle}>Defina regras, data e convide sua galera.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={onJoinExisting}>
                <Ionicons name="log-in-outline" size={22} color="#FFE6D5" />
                <View style={styles.optionTextWrapper}>
                  <Text style={styles.optionTitle}>Entrar em um grupo</Text>
                  <Text style={styles.optionSubtitle}>Use o código e a senha enviados pelo administrador.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={onScanCode}>
                <Ionicons name="qr-code-outline" size={22} color="#FFE6D5" />
                <View style={styles.optionTextWrapper}>
                  <Text style={styles.optionTitle}>Escanear código</Text>
                  <Text style={styles.optionSubtitle}>Leia o QR Code do grupo com a câmera.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
  container: {
    width: "88%",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#1b0808",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionTextWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#D0D0E0",
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cancelText: {
    color: "#FFB4A2",
    fontSize: 14,
    fontWeight: "600",
  },
});
