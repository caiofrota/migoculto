import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChatMessage } from "../chat/chat-message-bubble";

interface Props {
  visible: boolean;
  onClose: () => void;
  canViewMessages: boolean; // só libera quando grupo estiver encerrado
  received: ChatMessage[];
  sent: ChatMessage[];
}

export const PrivateMessagesModal: React.FC<Props> = ({ visible, onClose, canViewMessages, received, sent }) => {
  const [tab, setTab] = useState<"received" | "sent">("received");

  const data = tab === "received" ? received : sent;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Mensagens privadas</Text>

          {!canViewMessages ? (
            <View style={styles.blocked}>
              <Text style={styles.blockedText}>
                As mensagens do seu amigo secreto serão liberadas{"\n"}
                quando o grupo for encerrado.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, tab === "received" && styles.tabActive]} onPress={() => setTab("received")}>
                  <Text style={[styles.tabText, tab === "received" && styles.tabTextActive]}>Recebidas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, tab === "sent" && styles.tabActive]} onPress={() => setTab("sent")}>
                  <Text style={[styles.tabText, tab === "sent" && styles.tabTextActive]}>Enviadas</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={data}
                keyExtractor={(m) => String(m.id)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.messageRow}>
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleString()}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma mensagem {tab === "received" ? "recebida" : "enviada"}.</Text>}
              />
            </>
          )}

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
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: "#1a0a0a",
    borderRadius: 18,
    padding: 16,
    maxHeight: "85%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  blocked: {
    paddingVertical: 20,
    alignItems: "center",
  },
  blockedText: {
    color: "#FFE6D5",
    textAlign: "center",
    fontSize: 14,
  },
  tabs: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#E53935",
    borderRadius: 999,
  },
  tabText: {
    color: "#FFE6D5",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    paddingVertical: 4,
  },
  messageRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  messageTime: {
    marginTop: 2,
    color: "#B0B0C6",
    fontSize: 12,
  },
  emptyText: {
    marginTop: 12,
    textAlign: "center",
    color: "#B0B0C6",
  },
  button: {
    alignSelf: "flex-end",
    marginTop: 10,
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
