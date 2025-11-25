import React from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface MemberWithWishlist {
  id: number;
  userId: number;
  isConfirmed: boolean;
  firstName?: string | null;
  lastName?: string | null;
  wishlistCount: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  members: MemberWithWishlist[];
  myMemberId: number | null;
  myAssignedUserId: number | null;
  onOpenMemberWishlist: (memberId: number) => void;
}

export const MembersModal: React.FC<Props> = ({ visible, onClose, members, myMemberId, myAssignedUserId, onOpenMemberWishlist }) => {
  const renderItem = ({ item }: { item: MemberWithWishlist }) => {
    const fullName = (item.firstName || "") + " " + (item.lastName || "");

    const isMe = item.id === myMemberId;
    const isMyDraw = item.userId === myAssignedUserId;

    return (
      <TouchableOpacity style={styles.row} onPress={() => onOpenMemberWishlist(item.id)} activeOpacity={0.8}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(item.firstName?.[0] || "?").toUpperCase()}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.name}>{fullName.trim() || "Participante sem nome"}</Text>
          <View style={styles.badgesRow}>
            {isMe && <Text style={styles.badge}>Você</Text>}
            {item.isConfirmed && <Text style={styles.badge}>Confirmado</Text>}
            {isMyDraw && <Text style={styles.badgeHighlight}>Você tirou</Text>}
          </View>
          <Text style={styles.wishlistInfo}>
            {item.wishlistCount === 0 ? "Nenhum item na lista ainda" : `${item.wishlistCount} item(s) na lista`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Membros do grupo</Text>

          <FlatList data={members} keyExtractor={(m) => String(m.id)} renderItem={renderItem} contentContainerStyle={styles.listContent} />

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
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  listContent: {
    paddingVertical: 6,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#5A0000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  rowInfo: {
    flex: 1,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#FFE6D5",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 11,
    marginRight: 4,
  },
  badgeHighlight: {
    backgroundColor: "#2E7D32",
    color: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 11,
  },
  wishlistInfo: {
    marginTop: 2,
    color: "#B0B0C6",
    fontSize: 13,
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
