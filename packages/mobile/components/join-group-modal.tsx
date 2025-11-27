import { CustomError } from "@/errors";
import { apiService } from "@/services/api";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useGroups } from "./provider";

interface JoinGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (groupId: number) => void;
  scannedData?: string;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ visible, onClose, onConfirm, scannedData }) => {
  const { setGroupDetails } = useGroups();

  const [groupCode, setGroupCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  async function handleConfirm() {
    setError(undefined);
    try {
      if (!groupCode) {
        setError("Por favor, insira o código do grupo.");
        return;
      }
      if (!password) {
        setError("Por favor, insira a senha do grupo.");
        return;
      }
      setLoading(true);
      const group = await apiService.group.join(Number(groupCode), password);
      setGroupCode("");
      setPassword("");
      setGroupDetails(group.id, group);
      onConfirm(group.id);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.type === "NotFoundError") {
          setError("Grupo não encontrado. Verifique o código e a senha.");
          return;
        } else if (error.type === "ConflictError") {
          setError("Você já é membro deste grupo.");
          return;
        }
      }
      setError("Código ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (scannedData) {
      setGroupCode("");
      setPassword("");
      try {
        const data = JSON.parse(scannedData);
        setGroupCode(data.groupCode);
        setPassword(data.password);
      } catch {
        setError("O código escaneado é inválido.");
      }
    }
  }, [scannedData]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
              <View style={styles.box}>
                <Text style={styles.title}>Entrar em um grupo</Text>

                <Text style={styles.label}>Código do grupo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 12345"
                  placeholderTextColor="#aaa"
                  value={groupCode}
                  onChangeText={setGroupCode}
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                {error ? <Text style={{ color: "#FF6B6B", marginTop: 8 }}>{error}</Text> : null}

                <View style={styles.buttonsRow}>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton, loading && styles.buttonDisabled]}
                    onPress={handleConfirm}
                    disabled={loading}
                  >
                    <Text style={styles.confirmText}>{loading ? "Entrando..." : "Entrar"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
  },
  box: {
    backgroundColor: "#1a0a0a",
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  label: {
    color: "#FCE9B3",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 22,
    gap: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {},
  cancelText: {
    color: "#FFB4A2",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#E53935",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
