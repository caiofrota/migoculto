import { ChatInputBar } from "@/components/chat/chat-input-bar";
import { ChatMessage, ChatMessageBubble } from "@/components/chat/chat-message-bubble";
import { AdminDrawModal } from "@/components/group/admin-draw-modal";
import { GroupQRCodeModal } from "@/components/group/group-qrcode";
import { GroupInfoModal } from "@/components/group/info-modal";
import { MembersModal } from "@/components/group/members-modal";
import { GroupMenuSheet } from "@/components/group/menu-sheet";
import { WishlistItem, WishlistModal } from "@/components/group/wishlist-modal";
import { useGroupData } from "@/components/provider";
import { apiService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GroupStatus = "OPEN" | "CLOSED" | "DRAWN";

export default function GroupChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const numericGroupId = Number(groupId);

  const { data, setData, markAsRead } = useGroupData(groupId);
  const [activeTab, setActiveTab] = useState<"general" | "assignedOf" | "myAssigned">("general");

  const [myWishlist, setMyWishlist] = useState<WishlistItem[]>([]);
  const [selectedMemberWishlist, setSelectedMemberWishlist] = useState<{
    memberId: number;
    name: string;
    items: WishlistItem[];
  } | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [membersVisible, setMembersVisible] = useState(false);
  const [myWishlistVisible, setMyWishlistVisible] = useState(false);
  const [adminDrawVisible, setAdminDrawVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const messagesToRender =
    activeTab === "general"
      ? data?.groupMessages || []
      : activeTab === "assignedOf"
        ? data?.messagesAsGiftReceiver || []
        : data?.messagesAsGiftSender || [];

  const handleSendMessage = async (text: string, receiverId?: number) => {
    setData((prev) => ({
      ...prev,
      groupMessages: !receiverId
        ? [
            ...prev.groupMessages,
            { id: Math.random() * -1, content: text, createdAt: new Date().toISOString(), isMine: true, sender: "Você" },
          ]
        : prev.groupMessages,
      messagesAsGiftReceiver:
        receiverId === prev.assignedOfUserId
          ? [
              ...prev.messagesAsGiftReceiver,
              { id: Math.random() * -1, content: text, createdAt: new Date().toISOString(), isMine: true, sender: "Você" },
            ]
          : prev.messagesAsGiftReceiver,
      messagesAsGiftSender:
        receiverId === prev.myAssignedUserId
          ? [
              ...prev.messagesAsGiftSender,
              { id: Math.random() * -1, content: text, createdAt: new Date().toISOString(), isMine: true, sender: "Você" },
            ]
          : prev.messagesAsGiftSender,
      lastMessage: {
        id: Math.random() * -1,
        sender: "Você",
        content: text,
        createdAt: new Date().toISOString(),
        isMine: true,
      },
      lastMessageAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    }));
    await apiService.group.sendMessage(numericGroupId, text, receiverId);
  };

  useEffect(() => {
    if (!data?.lastMessageAt) return;

    // avoid running on the same frame as rendering
    const timeout = setTimeout(() => {
      markAsRead();
    }, 120);

    return () => clearTimeout(timeout);
  }, [data?.lastMessageAt, markAsRead]);

  const handleAddWishlistItem = async (payload: Omit<WishlistItem, "id">) => {
    try {
      /*const item = await apiService.addWishlistItem(numericGroupId, payload);
      setMyWishlist((prev) => [...prev, item]);*/
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
    }
  };

  const handleOpenMemberWishlist = async (memberId: number) => {
    try {
      /*const res = await apiService.getMemberWishlist(numericGroupId, memberId);
      setSelectedMemberWishlist({
        memberId,
        name: res.memberName,
        items: res.items,
      });*/
    } catch (err) {
      console.error("Erro ao carregar wishlist de membro:", err);
    }
  };

  const handleConfirmDraw = async () => {
    if (!data) return;
    try {
      //await apiService.drawSecretFriend(numericGroupId);
      setAdminDrawVisible(false);
    } catch (err) {
      console.error("Erro ao sortear:", err);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => <ChatMessageBubble message={item} />;

  const handleSendInCurrentTab = (text: string) => {
    if (activeTab === "general") return handleSendMessage(text);
    if (activeTab === "assignedOf") return handleSendMessage(text, data?.assignedOfUserId ?? undefined);
    return handleSendMessage(text, data?.myAssignedUserId ?? undefined);
  };

  if (!data) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color="#FFB4A2" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.groupName} numberOfLines={1}>
              {data.name}
            </Text>
            <Text style={styles.groupSubtitle}>
              {data.status === "OPEN" ? "Em aberto" : data.status === "DRAWN" ? "Sorteio realizado" : "Encerrado"}
            </Text>
          </View>

          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerMenuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFE6D5" />
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          {activeTab === "myAssigned" ? (
            <Text style={styles.bannerText}>Só você e quem você tirou podem ver as mensagens aqui.</Text>
          ) : activeTab === "assignedOf" ? (
            <Text style={styles.bannerText}>Só você e quem tirou você podem ver as mensagens aqui.</Text>
          ) : (
            <Text style={styles.bannerText}>As mensagens aqui são públicas e todos do grupo podem ver.</Text>
          )}
        </View>

        {/* LISTA DE MENSAGENS (GRUPO / PRIVADO) */}
        <FlatList
          ref={flatListRef}
          data={messagesToRender}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.bottomArea}>
          <View style={styles.chatTabs}>
            <TouchableOpacity
              style={[styles.chatTab, activeTab === "general" && styles.chatTabActive]}
              onPress={() => setActiveTab("general")}
            >
              <Text style={[styles.chatTabText, activeTab === "general" && styles.chatTabTextActive]}>Grupo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.chatTab, !data.assignedOfUserId && styles.chatTabDisabled, activeTab === "assignedOf" && styles.chatTabActive]}
              onPress={() => setActiveTab("assignedOf")}
              disabled={!data.assignedOfUserId}
            >
              <Text style={[styles.chatTabText, activeTab === "assignedOf" && styles.chatTabTextActive]}>Quem me tirou</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.chatTab, !data.assignedOfUserId && styles.chatTabDisabled, activeTab === "myAssigned" && styles.chatTabActive]}
              onPress={() => setActiveTab("myAssigned")}
              disabled={!data.myAssignedUserId}
            >
              <Text style={[styles.chatTabText, activeTab === "myAssigned" && styles.chatTabTextActive]}>Quem eu tirei</Text>
            </TouchableOpacity>
          </View>

          <ChatInputBar
            onSend={handleSendInCurrentTab}
            placeholder={
              activeTab === "general"
                ? "Mensagem para o grupo..."
                : activeTab === "assignedOf"
                  ? "Mensagem para quem te tirou..."
                  : "Mensagem para quem você tirou..."
            }
          />
        </View>

        <GroupMenuSheet
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          isAdmin={data.isOwner}
          status={data.status}
          onOpenInfo={() => setInfoVisible(true)}
          onOpenMembers={() => setMembersVisible(true)}
          onOpenMyWishlist={() => setMyWishlistVisible(true)}
          onQRCode={() => setQrCodeVisible(true)}
          onOpenAdminDraw={() => setAdminDrawVisible(true)}
        />

        <GroupInfoModal visible={infoVisible} onClose={() => setInfoVisible(false)} group={data} />

        <MembersModal
          visible={membersVisible}
          onClose={() => setMembersVisible(false)}
          members={data?.members}
          myMemberId={data.myMemberId}
          myAssignedUserId={data.myAssignedUserId}
          onOpenMemberWishlist={handleOpenMemberWishlist}
        />

        <WishlistModal
          visible={myWishlistVisible}
          onClose={() => setMyWishlistVisible(false)}
          title="Minha lista de presentes"
          canEdit
          items={myWishlist}
          onAddItem={handleAddWishlistItem}
        />

        <WishlistModal
          visible={!!selectedMemberWishlist}
          onClose={() => setSelectedMemberWishlist(null)}
          title={selectedMemberWishlist ? `Lista de ${selectedMemberWishlist.name}` : ""}
          canEdit={false}
          items={selectedMemberWishlist?.items || []}
        />

        <AdminDrawModal
          visible={adminDrawVisible}
          onClose={() => setAdminDrawVisible(false)}
          status={data.status as GroupStatus}
          onConfirmDraw={handleConfirmDraw}
        />

        <GroupQRCodeModal visible={qrCodeVisible} onClose={() => setQrCodeVisible(false)} group={data} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
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
  banner: {
    marginHorizontal: 10,
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  bannerText: {
    fontSize: 13,
    textAlign: "center",
    color: "#FFE6D5",
  },
  messagesContent: {
    paddingVertical: 6,
  },
  bottomArea: {
    backgroundColor: "#5A0000",
  },
  chatTabs: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 0,
    gap: 6,
  },
  chatTab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
  },
  chatTabDisabled: {
    opacity: 0.5,
  },
  chatTabActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  chatTabText: {
    fontSize: 13,
    color: "#FFE6D5",
  },
  chatTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
