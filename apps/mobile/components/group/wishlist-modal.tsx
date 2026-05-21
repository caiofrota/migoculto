import { apiService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Linking, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth, useGroupData } from "../provider";

export interface WishlistItem {
  id: number;
  name: string;
  description?: string | null;
  url?: string | null;
  priority?: number | null;
}

interface Props {
  groupId: number;
  memberId: number;
  visible: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<Props> = ({ groupId, memberId, visible, onClose }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const { data, setData, refresh } = useGroupData(groupId);
  const [member, setMember] = useState<{ id: number; userId: number; firstName?: string | null; lastName?: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    try {
      setLoading(true);
      await apiService.wishlist.addItem(data!.id, name.trim(), url.trim() || undefined, description.trim() || undefined);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: [
            ...prev.members.map((m) => {
              if (m.userId !== user!.id) return m;
              return {
                ...m,
                wishlistCount: m.wishlistCount + 1,
                wishlist: [
                  ...(m.wishlist ? m.wishlist : []),
                  {
                    id: Math.random(),
                    name: name,
                    url: url,
                    description: description,
                  },
                ],
              };
            }),
          ],
        };
      });
      setName("");
      setUrl("");
      setDescription("");
      setTimeout(refresh, 5000);
    } finally {
      setLoading(false);
    }
  }

  function handleRemove(itemId: number) {
    Alert.alert("Remover item", "Tem certeza que deseja remover este item da lista de desejos?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => await removeItem(itemId),
      },
    ]);
  }

  async function removeItem(itemId: number) {
    try {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: [
            ...prev.members.map((m) => {
              if (m.userId !== user!.id) return m;
              return {
                ...m,
                wishlistCount: m.wishlistCount - 1,
                wishlist: m.wishlist.filter((i) => i.id !== itemId),
              };
            }),
          ],
        };
      });
      await apiService.wishlist.removeItem(data!.id, itemId);
    } finally {
      refresh();
    }
  }

  function openUrl(url: string | null | undefined) {
    if (url) {
      const fullUrl = ["http://", "https://"].includes(url) ? url : `http://${url}`;
      Linking.openURL(fullUrl);
    }
  }

  useEffect(() => {
    if (data) {
      const member = data?.members.find((m) => m.id === memberId);
      setMember(member || null);
    }
  }, [memberId, data]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>
            {member?.userId === user?.id ? "Minha lista de presentes" : `Lista de ${member?.firstName} ${member?.lastName}`}
          </Text>

          {user?.id === member?.userId && (
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
              <TouchableOpacity style={[styles.addButton, loading && styles.buttonDisabled]} disabled={loading} onPress={handleAdd}>
                <Text style={styles.addButtonText}>{loading ? "Adicionando..." : "Adicionar"}</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={data?.members?.find((m) => m.id === memberId)?.wishlist ?? ([] as any)}
            keyExtractor={(i) => String(i.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.itemRow} onPress={() => openUrl(item.url)}>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.url && <Ionicons name="cart" size={20} color="#6EAD72" />}
                  </View>
                  {item.description && <Text style={styles.itemText}>{item.description}</Text>}
                </View>
                {user?.id === member?.userId && (
                  <TouchableOpacity onPress={() => handleRemove(item.id)}>
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
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
  buttonDisabled: {
    opacity: 0.6,
  },
  listContent: {
    paddingVertical: 6,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  itemContent: {
    paddingVertical: 8,
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
