import { GroupQRCodeModal } from "@/components/group/group-qrcode";
import { WishlistModal } from "@/components/group/wishlist-modal";
import { useAuth, useGroupData, useGroups } from "@/components/provider";
import { CustomError } from "@/errors";
import { apiService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupInfo() {
  const { user } = useAuth();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { removeGroup } = useGroups();
  const { data, setData } = useGroupData(groupId);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [wishlistVisible, setWishlistVisible] = useState(false);
  const [selectedMemberWishlist, setSelectedMemberWishlist] = useState<number>(0);

  function goToMessages() {
    setMenuVisible(false);
    router.push(`/group/details?groupId=${groupId}`);
  }

  function editGroup() {
    setMenuVisible(false);
    router.push(`/group/update?groupId=${groupId}`);
  }

  function openMemberWishlist(memberId: number) {
    setMenuVisible(false);
    setSelectedMemberWishlist(memberId);
    setWishlistVisible(true);
  }

  async function drawGroup() {
    if (!data) return;
    try {
      setIsLoading(true);
      const result = await apiService.group.draw(data.id);
      setData((prev) => ({
        ...prev,
        status: "DRAWN",
        updatedAt: new Date().toISOString(),
        myAssignedUserId: result.members.find((m: any) => m.userId === prev.userId)?.assignedUserId || null,
        members: prev.members.map((member) => ({
          ...member,
          assignedUserId: result.members.find((m: any) => m.userId === member.userId)?.assignedUserId || null,
        })),
      }));
      setMessage("Sorteio realizado com sucesso!");
    } catch (error) {
      if (error instanceof CustomError) {
        setMessage(error.message);
      } else {
        setMessage("Ocorreu um erro ao sortear. Tente novamente mais tarde. Se o problema persistir, contate o suporte.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function drawGroupConfirmation() {
    if (data?.status === "OPEN") {
      Alert.alert("Confirmar sorteio", "Tem certeza que deseja sortear o amigo secreto? Ninguém poderá mais sair ou entrar do grupo!", [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sortear",
          style: "destructive",
          onPress: () => {
            drawGroup();
          },
        },
      ]);
    } else if (data?.status === "DRAWN") {
      Alert.alert(
        "Refazer sorteio",
        "Tem certeza que deseja refazer o sorteio do amigo secreto? O sorteio anterior não poderá ser recuperado!",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Refazer",
            style: "destructive",
            onPress: () => {
              drawGroup();
            },
          },
        ],
      );
    }
  }

  function removeMember(memberId: number) {
    Alert.alert(
      "Remover membro",
      "Tem certeza que deseja remover este membro do grupo? Ele poderá entrar novamente usando o ID e a senha do grupo.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              setMenuVisible(false);
              await apiService.group.removeMember(data?.id ?? 0, memberId);
              setData((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  members: prev.members.filter((m) => m.id !== memberId),
                };
              });
            } catch (error) {
              if (error instanceof CustomError) {
                setMessage(error.message);
              } else {
                setMessage("Ocorreu um erro ao remover o membro. Tente novamente mais tarde. Se o problema persistir, contate o suporte.");
              }
            }
          },
        },
      ],
    );
  }

  function leaveGroup() {
    Alert.alert("Sair do grupo", "Tem certeza que deseja sair do grupo? Você poderá entrar novamente usando o ID e a senha do grupo.", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            setMenuVisible(false);
            await apiService.group.leave(data?.id ?? 0);
            removeGroup(data?.id ?? 0);
            router.replace("/");
          } catch (error) {
            if (error instanceof CustomError) {
              setMessage(error.message);
            } else {
              setMessage("Ocorreu um erro ao sair do grupo. Tente novamente mais tarde. Se o problema persistir, contate o suporte.");
            }
          }
        },
      },
    ]);
  }

  if (!data || !user) return null;

  const date = new Date(data.eventDate);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <KeyboardAvoidingView style={styles.main} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.groupName} numberOfLines={1}>
              {data.name}
            </Text>
            <Text style={styles.groupSubtitle}>
              {data.status === "OPEN" ? "Em aberto" : data.status === "DRAWN" ? "Sorteio realizado" : "Encerrado"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={goToMessages} style={styles.headerMenuButton}>
              <Ionicons name="chatbox-ellipses" size={20} color="#FFE6D5" />
              {data.unreadCount > 0 && (
                <View
                  style={{
                    minWidth: 16,
                    paddingHorizontal: 2,
                    height: 16,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: "#8B0000",
                    backgroundColor: "#6EAD72",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: -2,
                    right: -2,
                  }}
                >
                  <Text style={{ color: "#8B0000", fontSize: 12 }}>{data.unreadCount > 9 ? "+9" : data.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerMenuButton}>
              <Ionicons name="ellipsis-vertical" size={20} color="#FFE6D5" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={styles.info}>
            <View>
              <View style={styles.infoItem}>
                <Text style={styles.infoTitle}>Código do grupo:</Text>
                <Text style={styles.infoText}>{data.code?.replace(/(\w{4})(\w{4})/, "$1-$2")}</Text>
              </View>
            </View>
            <View>
              <View style={styles.infoItem}>
                <Text style={styles.infoTitle}>Senha:</Text>
                <Text style={styles.infoText}>{data.password}</Text>
              </View>
            </View>
            {data.description && (
              <View>
                <View style={styles.infoItemCol}>
                  <Text style={styles.infoTitle}>Descrição:</Text>
                  <Text style={styles.infoText}>{data.description}</Text>
                </View>
              </View>
            )}
            <View>
              <View style={styles.infoItem}>
                <Text style={styles.infoTitle}>Evento:</Text>
                <Text style={styles.infoText}>
                  {formattedDate} às {formattedTime}
                </Text>
              </View>
            </View>
            {data.location && (
              <View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoTitle}>Localização:</Text>
                  <Text style={styles.infoText}>{data.location}</Text>
                </View>
              </View>
            )}
            {data.additionalInfo && (
              <View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoTitle}>Informações adicionais:</Text>
                  <Text style={styles.infoText}>{data.additionalInfo}</Text>
                </View>
              </View>
            )}
            {data.isOwner && data.status !== "CLOSED" && (
              <TouchableOpacity
                onPress={drawGroupConfirmation}
                style={[(isLoading || data.members.length < 3) && styles.disabledButton]}
                disabled={isLoading || data.members.length < 3}
              >
                <Text style={styles.drawButtonText}>
                  {isLoading
                    ? "Sorteando..."
                    : data.members.length >= 3
                      ? data.status === "OPEN"
                        ? "Sortear amigo secreto"
                        : "Refazer sorteio"
                      : "Mínimo de 3 membros para sortear"}
                </Text>
              </TouchableOpacity>
            )}
            {message && (
              <View style={styles.message}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            )}
          </View>
          <Text style={styles.membersTitle}>Membros</Text>
          <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
            {data.members?.map((member) => (
              <TouchableOpacity key={member.id} style={styles.memberContainer} onPress={() => openMemberWishlist(member.id)}>
                <View style={styles.memberDescription}>
                  <Text
                    style={[
                      styles.memberName,
                      member.userId === user.id && styles.memberMe,
                      member.userId === data.myAssignedUserId && styles.memberAssigned,
                    ]}
                  >
                    {member.firstName} {member.lastName} {member.userId === user.id ? "(Você)" : ""}
                    {member.userId === data.myAssignedUserId ? "(Seu amigo secreto)" : ""}
                  </Text>
                  <Text style={styles.memberWishlistCount}>Itens na lista de desejos: {member.wishlistCount}</Text>
                </View>
                {data.isOwner && data.status === "OPEN" && member.userId !== data.ownerId && (
                  <TouchableOpacity onPress={() => removeMember(member.id)}>
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.backdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.sheet}>
                  <Text style={styles.title}>Opções do grupo</Text>
                  <TouchableOpacity style={styles.item} onPress={goToMessages}>
                    <Text style={styles.itemText}>Ir para mensagens</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.item} onPress={() => openMemberWishlist(data.myMemberId)}>
                    <Text style={styles.itemText}>Minha lista de presentes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setMenuVisible(false);
                      setQrCodeVisible(true);
                    }}
                  >
                    <Text style={styles.itemText}>QR code do grupo</Text>
                  </TouchableOpacity>

                  {data.isOwner && (
                    <TouchableOpacity style={styles.item} onPress={editGroup}>
                      <Text style={styles.itemText}>Editar grupo</Text>
                    </TouchableOpacity>
                  )}

                  {!data.isOwner && data.status === "OPEN" && (
                    <TouchableOpacity style={styles.item} onPress={leaveGroup}>
                      <Text style={styles.itemText}>Sair do grupo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <GroupQRCodeModal visible={qrCodeVisible} onClose={() => setQrCodeVisible(false)} group={data} />
        <WishlistModal
          visible={wishlistVisible}
          onClose={() => setWishlistVisible(false)}
          memberId={selectedMemberWishlist}
          groupId={data.id}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#8B0000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
  headerBackButton: {
    padding: 4,
    marginRight: 4,
  },
  headerCenter: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  groupSubtitle: {
    fontSize: 13,
    color: "#FFE6D5",
  },
  headerMenuButton: {
    padding: 6,
    marginLeft: 4,
  },
  info: {
    marginHorizontal: 10,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.15)",
    gap: 6,
  },
  infoItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  infoItemCol: {
    flexDirection: "column",
    gap: 6,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 18,
    color: "#FFE6D5",
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 18,
    color: "#FFE6D5",
  },
  drawButtonText: {
    padding: 6,
    paddingVertical: 10,
    backgroundColor: "#2E7D32",
    borderRadius: 6,
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  message: {
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFE6D5",
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  memberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  memberWishlistCount: {
    fontSize: 16,
    color: "#FFE6D5",
  },
  memberDescription: {
    flexDirection: "column",
    gap: 4,
  },
  memberMe: {
    color: "#FCE9B3",
  },
  memberAssigned: {
    color: "#6EAD72",
  },
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
});
