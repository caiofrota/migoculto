import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  status: "OPEN" | "CLOSED" | "DRAWN";
  onConfirmDraw: () => void;
}

export const AdminDrawModal: React.FC<Props> = ({ visible, onClose, status, onConfirmDraw }) => {
  const isDrawn = status === "DRAWN";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>{isDrawn ? "Refazer sorteio?" : "Confirmar sorteio?"}</Text>

          <Text style={styles.text}>
            {isDrawn
              ? "Isso irá refazer o sorteio e substituir os pares atuais. Os participantes serão notificados das novas combinações."
              : "Ao sortear, cada participante passará a ter seu amigo secreto definido. Você ainda poderá refazer o sorteio depois, se necessário."}
          </Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirmDraw}>
              <Text style={styles.confirmText}>{isDrawn ? "Refazer sorteio" : "Sortear agora"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: "#1a0a0a",
    borderRadius: 18,
    padding: 18,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  text: {
    marginTop: 8,
    color: "#EDEDF5",
    fontSize: 15,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
  },
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 4,
  },
  cancelText: {
    color: "#FFB4A2",
    fontWeight: "600",
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#2E7D32",
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
