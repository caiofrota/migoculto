import { useAuth } from "@/components/provider";
import { CustomError } from "@/errors";
import { apiService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setMessage(null);
      if (!firstName) {
        setMessage("Nome é obrigatório.");
        return;
      }
      setLoading(true);
      await apiService.editProfile(firstName.trim(), lastName.trim());
      setUser({ ...user!, firstName: firstName.trim(), lastName: lastName.trim() });
      setMessage("Usuário atualizado com sucesso.");
    } catch (err: any) {
      if (err instanceof CustomError) {
        setMessage([err.message, err.action].filter(Boolean).join(" "));
      } else {
        setMessage(err.message || "Não foi possível registrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.main} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Editar Perfil
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Sobrenome" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />

          {message && <Text style={styles.message}>{message}</Text>}

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  headerCenter: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: 24,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: "#2c1c1c",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  button: {
    backgroundColor: "#16B97D",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center" as const,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold" as const,
  },
  message: {
    color: "#fecaca",
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    textAlign: "center" as const,
    fontSize: 18,
  },
  link: {
    marginTop: 24,
    alignSelf: "center" as const,
  },
  linkText: {
    color: "#fee685",
    textDecorationLine: "underline" as const,
  },
});
