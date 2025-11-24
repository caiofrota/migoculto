import { AddGroupActionSheet } from "@/components/add-group-action-sheet";
import { JoinGroupModal } from "@/components/join-group-modal";
import { useAuth } from "@/components/provider";
import { QrScannerModal } from "@/components/qr-scanner-modal";
import { apiService, Group } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "all" | "owner" | "participant";

interface GroupsScreenProps {
  onOpenGroup?: (groupId: number) => void;
}

export const GroupsScreen: React.FC<GroupsScreenProps> = ({ onOpenGroup }) => {
  const { logout } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>([]);

  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [joinGroupCode, setJoinGroupCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");

  const handleFabPress = () => {
    setIsActionSheetOpen(true);
  };

  const { activeGroups, archivedGroups } = useMemo(() => {
    const active = groups.filter((g) => !g.isArchived);
    const archived = groups.filter((g) => g.isArchived);
    return { activeGroups: active, archivedGroups: archived };
  }, [groups]);

  const filteredActiveGroups = useMemo(() => {
    switch (filter) {
      case "owner":
        return activeGroups.filter((g) => g.isOwner);
      case "participant":
        return activeGroups.filter((g) => !g.isOwner);
      default:
        return activeGroups;
    }
  }, [activeGroups, filter]);

  const handleOpenGroup = (id: number) => {
    if (onOpenGroup) {
      onOpenGroup(id);
    } else {
      console.log("Open group:", id);
    }
  };

  const handleCreateGroup = () => {
    //router.push("/create-group");
  };

  const handleSelectCreate = () => {
    setIsActionSheetOpen(false);
    handleCreateGroup();
  };

  const handleSelectJoin = () => {
    setIsActionSheetOpen(false);
    setIsJoinModalOpen(true);
  };

  const handleSelectScan = () => {
    setIsActionSheetOpen(false);
    setIsScannerOpen(true);
  };

  const handleConfirmJoin = async () => {
    try {
      /*
    await apiService.joinGroup({
      code: joinGroupCode,
      password: joinPassword,
    });
*/
      setIsJoinModalOpen(false);
      setJoinGroupCode("");
      setJoinPassword("");

      const updatedGroups = await apiService.getAllGroups();
      setGroups(updatedGroups);
    } catch (error) {
      console.error("Erro ao entrar no grupo:", error);
    }
  };

  const handleCodeScanned = (data: string) => {
    setJoinGroupCode(data);
    setJoinPassword("");
    setIsJoinModalOpen(true);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await apiService.getAllGroups();
        setGroups(groups);
        console.log(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  function parseStatus(status: string) {
    switch (status) {
      case "OPEN":
        return "Em aberto";
      case "CLOSED":
        return "Encerrado";
      case "DRAWN":
        return "Sorteado";
      default:
        return status;
    }
  }

  const renderGroupItem = ({ item }: { item: Group }) => {
    const initials = getInitials(item.name);

    return (
      <TouchableOpacity onPress={() => handleOpenGroup(item.id)} style={styles.rowContainer} activeOpacity={0.8}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.rowContent}>
          <View style={styles.rowTitleContainer}>
            <Text numberOfLines={1} style={styles.groupName}>
              {item.name}
            </Text>
            {item.isOwner && (
              <View style={styles.ownerBadge}>
                <Ionicons name="key" size={12} color="#FCE9B3" />
                <Text style={styles.ownerBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <View style={styles.rowSubtitleContainer}>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {item.lastMessage?.content || "Comece a conversa com o seu grupo!"}
            </Text>
          </View>
        </View>
        <View style={styles.rowMeta}>
          <Text style={styles.statusLabel}>{parseStatus(item.status)}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount > 9 ? "9+" : item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>MigOculto</Text>
          <Text style={styles.appSubtitle}>Seus grupos de amigo secreto</Text>
        </View>
        <Ionicons name="exit" size={26} color="#FFE6D5" onPress={logout} />
      </View>
      <View style={styles.filterContainer}>
        <FilterPill label="Todos" selected={filter === "all"} onPress={() => setFilter("all")} />
        <FilterPill label="Meus grupos" selected={filter === "owner"} onPress={() => setFilter("owner")} />
        <FilterPill label="Participando" selected={filter === "participant"} onPress={() => setFilter("participant")} />
      </View>
      <FlatList
        data={filteredActiveGroups}
        keyExtractor={(item) => String(item.id) + Math.random().toString()}
        renderItem={renderGroupItem}
        contentContainerStyle={[styles.listContent, filteredActiveGroups.length === 0 && styles.emptyListContent]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="sparkles-outline" size={40} color="#FFB4A2" />
            <Text style={styles.emptyTitle}>Nenhum grupo por aqui… ainda!</Text>
            <Text style={styles.emptySubtitle}>Comece criando um grupo e convide sua galera para o próximo MigOculto.</Text>
          </View>
        }
      />

      {archivedGroups.length > 0 && (
        <View style={styles.archivedSection}>
          <TouchableOpacity style={styles.archivedHeader} onPress={() => setShowArchived((prev) => !prev)} activeOpacity={0.8}>
            <View style={styles.archivedHeaderLeft}>
              <Ionicons name={showArchived ? "chevron-down" : "chevron-forward"} size={18} color="#FFE6D5" />
              <Text style={styles.archivedTitle}>Arquivados</Text>
              <Text style={styles.archivedCount}>({archivedGroups.length})</Text>
            </View>
          </TouchableOpacity>
          {showArchived && (
            <FlatList
              data={archivedGroups}
              keyExtractor={(item) => String(item.id) + Math.random().toString()}
              renderItem={renderGroupItem}
              style={styles.archivedList}
              contentContainerStyle={styles.archivedItemWrapper}
            />
          )}
        </View>
      )}
      <TouchableOpacity style={styles.fab} onPress={handleFabPress} activeOpacity={0.9}>
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <AddGroupActionSheet
        visible={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onCreateNew={handleSelectCreate}
        onJoinExisting={handleSelectJoin}
        onScanCode={handleSelectScan}
      />
      <JoinGroupModal
        visible={isJoinModalOpen}
        groupCode={joinGroupCode}
        password={joinPassword}
        onChangeGroupCode={setJoinGroupCode}
        onChangePassword={setJoinPassword}
        onConfirm={handleConfirmJoin}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <QrScannerModal visible={isScannerOpen} onClose={() => setIsScannerOpen(false)} onCodeScanned={handleCodeScanned} />
    </SafeAreaView>
  );
};

interface FilterPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity style={[styles.filterPill, selected && styles.filterPillSelected]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.filterPillText, selected && styles.filterPillTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
};

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#8B0000",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  appSubtitle: {
    fontSize: 20,
    color: "#CBCBD6",
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(15, 18, 28, 0.9)",
  },
  filterPillSelected: {
    backgroundColor: "#E53935",
    borderColor: "#E53935",
  },
  filterPillText: {
    fontSize: 16,
    color: "#E0E0E0",
    fontWeight: "500",
  },
  filterPillTextSelected: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    paddingBottom: 90,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 16,
    marginVertical: 2,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#2E7D32",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  rowContent: {
    flex: 1,
    justifyContent: "center",
  },
  rowTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  groupName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  ownerBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "rgba(229, 57, 53, 0.22)",
    gap: 4,
  },
  ownerBadgeText: {
    fontSize: 14,
    color: "#FCE9B3",
    fontWeight: "600",
  },
  rowSubtitleContainer: {
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 18,
    color: "#B9B9D5",
  },
  rowMeta: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 48,
    paddingLeft: 8,
  },
  statusLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#FFB4A2",
    fontWeight: "500",
  },
  unreadBadge: {
    marginTop: 4,
    minWidth: 20,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E7D32",
  },
  unreadBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  archivedSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  archivedHeader: {
    paddingVertical: 10,
  },
  archivedHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  archivedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFE6D5",
  },
  archivedCount: {
    fontSize: 16,
    color: "#BFBFCC",
  },
  archivedList: {
    paddingBottom: 4,
  },
  archivedItemWrapper: {
    opacity: 0.7,
  },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 18,
    color: "#B0B0C6",
    textAlign: "center",
  },
});

export default GroupsScreen;
