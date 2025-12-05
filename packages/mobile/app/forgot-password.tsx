import { apiService } from "@/services/api";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setMessage(null);
      if (!email) {
        setMessage("E-mail é obrigatório.");
        return;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage("O e-mail informado é inválido.");
        return;
      }
      setLoading(true);
      const res = await apiService.forgotPassword(email.trim());
      setMessage(res.message);
      setMessage("Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
    } catch {
      setMessage("Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoToLogin() {
    router.replace("/login"); // ajuste a rota se necessário
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {message && <Text style={styles.message}>{message}</Text>}

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Enviando..." : "Enviar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={handleGoToLogin}>
        <Text style={styles.linkText}>Lembrou sua senha? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center" as const,
    padding: 20,
    backgroundColor: "#8B0000",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 20,
    alignSelf: "center" as const,
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
};
