import { Group } from "@/services/api";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  group: Group | null;
}

export const GroupInfoModal: React.FC<Props> = ({ visible, onClose, group }) => {
  if (!group) return null;

  const date = new Date(group.eventDate);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusLabel = group.status === "OPEN" ? "Em aberto" : group.status === "DRAWN" ? "Sorteio realizado" : "Encerrado";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <ScrollView>
            <Text style={styles.title}>{group.name}</Text>
            <Text style={styles.status}>Status: {statusLabel}</Text>

            <Text style={styles.sectionTitle}>Código do grupo</Text>
            <Text style={styles.text}>{group.id}</Text>

            <Text style={styles.sectionTitle}>Senha para entrar</Text>
            <Text style={styles.text}>{group.password}</Text>

            {group.description && (
              <>
                <Text style={styles.sectionTitle}>Descrição</Text>
                <Text style={styles.text}>{group.description}</Text>
              </>
            )}

            {group.additionalInfo && (
              <>
                <Text style={styles.sectionTitle}>Informações adicionais</Text>
                <Text style={styles.text}>{group.additionalInfo}</Text>
              </>
            )}

            <Text style={styles.sectionTitle}>Evento</Text>
            <Text style={styles.text}>
              {formattedDate} às {formattedTime}
            </Text>

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
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  status: {
    marginTop: 4,
    color: "#FFB4A2",
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#FCE9B3",
  },
  text: {
    marginTop: 4,
    fontSize: 15,
    color: "#EDEDF5",
  },
  button: {
    alignSelf: "flex-end",
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E53935",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
