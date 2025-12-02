import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth, useGroupData } from "../provider";

export interface WishlistItem {
  id: number;
  name: string;
  description?: string | null;
  url?: string | null;
  priority?: number | null;
}

interface Props {
  memberId: number;
  visible: boolean;
  onClose: () => void;
  onAddItem?: (item: Omit<WishlistItem, "id">) => void;
}

export const WishlistModal: React.FC<Props> = ({ memberId, visible, onClose, onAddItem }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const { data } = useGroupData(memberId);
  const [member, setMember] = useState<{ id: number; firstName?: string | null; lastName?: string | null } | null>(null);

  const handleAdd = () => {
    if (!onAddItem || !name.trim()) return;
    onAddItem({
      name: name.trim(),
      url: url.trim() || null,
      description: description.trim() || null,
      priority: null,
    });
    setName("");
    setUrl("");
    setDescription("");
  };

  useEffect(() => {
    if (data) {
      console.log(data.members);
      const member = data?.members.find((m) => m.userId === memberId);
      console.log("member", member);
      setMember(member || null);
    }
  }, [memberId, data]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>
            {member?.id === user?.id ? "Minha lista de presentes" : `Lista de ${member?.firstName} ${member?.lastName}`}
          </Text>

          {user?.id === memberId && (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nome do presente"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
              <TextInput style={styles.input} placeholder="URL (opcional)" placeholderTextColor="#aaa" value={url} onChangeText={setUrl} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descrição (opcional)"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={[] as any}
            keyExtractor={(i) => String(i.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description && <Text style={styles.itemText}>{item.description}</Text>}
                {item.url && (
                  <Text style={styles.itemUrl} numberOfLines={1}>
                    {item.url}
                  </Text>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item cadastrado ainda.</Text>}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
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
    marginBottom: 10,
  },
  form: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 8,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  addButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#2E7D32",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    paddingVertical: 6,
  },
  itemRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  itemName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  itemText: {
    color: "#EDEDF5",
    fontSize: 14,
    marginTop: 2,
  },
  itemUrl: {
    color: "#FFB4A2",
    fontSize: 13,
    marginTop: 2,
  },
  emptyText: {
    color: "#B0B0C6",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#2E7D32",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
