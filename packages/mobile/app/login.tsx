import { useAuth } from "@/components/provider";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setError(null);
      if (!email && !password) {
        setError("E-mail e senha são obrigatórios.");
        return;
      }
      if (!email) {
        setError("E-mail é obrigatório.");
        return;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("O e-mail informado é inválido.");
        return;
      }
      if (!password) {
        setError("Senha é obrigatória.");
        return;
      }
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || "Não foi possível entrar. Tente novamente.");
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo-icon.png")} style={{ width: 150, height: 150, marginHorizontal: "auto" }} />
      <Text style={styles.title}>MigOculto</Text>
      <Text style={styles.subtitle}>Faça login para entrar no seu grupo</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#8B0000",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fee685",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#e5e7eb",
    marginBottom: 24,
    textAlign: "center",
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
  error: {
    color: "#fecaca",
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#16B97D",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#064e3b",
    fontWeight: "600",
    fontSize: 16,
  },
});
