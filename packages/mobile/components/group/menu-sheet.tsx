import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  isAdmin: boolean;
  status: "OPEN" | "CLOSED" | "DRAWN";
  onOpenInfo: () => void;
  onOpenMembers: () => void;
  onOpenMyWishlist: () => void;
  onQRCode: () => void;
  onOpenAdminDraw: () => void;
}

export const GroupMenuSheet: React.FC<Props> = ({
  visible,
  onClose,
  isAdmin,
  status,
  onOpenInfo,
  onOpenMembers,
  onOpenMyWishlist,
  onQRCode,
  onOpenAdminDraw,
}) => {
  const canDraw = isAdmin && status === "OPEN";
  const canResetDraw = isAdmin && status === "DRAWN";

  const handle = (fn: () => void) => {
    onClose();
    fn();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <Text style={styles.title}>Opções do grupo</Text>

              <TouchableOpacity style={styles.item} onPress={() => handle(onOpenInfo)}>
                <Text style={styles.itemText}>Ver descrição do grupo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.item} onPress={() => handle(onOpenMembers)}>
                <Text style={styles.itemText}>Membros e listas de presentes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.item} onPress={() => handle(onOpenMyWishlist)}>
                <Text style={styles.itemText}>Minha lista de presentes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.item} onPress={() => handle(onQRCode)}>
                <Text style={styles.itemText}>QR Code</Text>
              </TouchableOpacity>

              {canDraw && (
                <TouchableOpacity style={[styles.item, styles.adminItem]} onPress={() => handle(onOpenAdminDraw)}>
                  <Text style={[styles.itemText, styles.adminItemText]}>Sortear amigo secreto</Text>
                </TouchableOpacity>
              )}

              {canResetDraw && (
                <TouchableOpacity style={[styles.item, styles.adminItem]} onPress={() => handle(onOpenAdminDraw)}>
                  <Text style={[styles.itemText, styles.adminItemText]}>Refazer sorteio</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.cancel} onPress={onClose}>
                <Text style={styles.cancelText}>Fechar</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1a0a0a",
    paddingBottom: 24,
    paddingTop: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 15,
    color: "#FFE6D5",
  },
  adminItem: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    marginTop: 4,
  },
  adminItemText: {
    color: "#FFCDD2",
    fontWeight: "600",
  },
  badgeText: {
    fontSize: 13,
    color: "#FCE9B3",
  },
  cancel: {
    marginTop: 8,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  cancelText: {
    color: "#FFB4A2",
    fontSize: 15,
    fontWeight: "600",
  },
});
