import { Group } from "@/services/api";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface Props {
  visible: boolean;
  onClose: () => void;
  group: Group | null;
}

export const GroupQRCodeModal: React.FC<Props> = ({ visible, onClose, group }) => {
  if (!group) return null;

  const statusLabel = group.status === "OPEN" ? "Em aberto" : group.status === "DRAWN" ? "Sorteio realizado" : "Encerrado";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <ScrollView>
            <Text style={styles.title}>{group.name}</Text>
            <Text style={styles.status}>Status: {statusLabel}</Text>

            <View style={styles.credentialsContainer}>
              <View>
                <Text style={styles.sectionTitle}>Código do grupo</Text>
                <Text style={styles.text}>{group.id}</Text>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Senha para entrar</Text>
                <Text style={styles.text}>{group.password}</Text>
              </View>
            </View>

            <QRCode value={`${process.env.EXPO_PUBLIC_URI_SCHEME}?action=join&code=${group.id}&password=${group.password}`} size={250} />

            {group.location && (
              <>
                <Text style={styles.sectionTitle}>Local</Text>
                <Text style={styles.text}>{group.location}</Text>
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
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
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: "#1a0a0a",
    borderRadius: 18,
    padding: 20,
    maxHeight: "80%",
    width: "100%",
    alignItems: "center",
  },
  credentialsContainer: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  status: {
    marginTop: 4,
    color: "#FFB4A2",
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#FCE9B3",
    textAlign: "center",
  },
  text: {
    marginTop: 4,
    fontSize: 15,
    color: "#EDEDF5",
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#2E7D32",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
