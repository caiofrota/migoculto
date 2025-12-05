import { useAuth } from "@/components/provider";
import { isExpoGo } from "@/core/utils";
import { CustomError } from "@/errors";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Google Sign-In button loaded dynamically to avoid errors in Expo Go
type GoogleButtonType = typeof import("@react-native-google-signin/google-signin").GoogleSigninButton;
let GoogleSigninButtonDynamic: GoogleButtonType | null = null;
if (!isExpoGo) {
  const googleModule = require("@react-native-google-signin/google-signin");
  GoogleSigninButtonDynamic = googleModule.GoogleSigninButton;
}

export default function LoginScreen() {
  const { login, loginWithApple, loading } = useAuth();

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
      if (err instanceof CustomError) {
        setError([err.message, err.action].filter(Boolean).join(" "));
      } else {
        setError(err.message || "Não foi possível entrar. Tente novamente.");
      }
    }
  }
  /*
  async function handleGoogleLogin() {
    try {
      setError(null);

      await loginWithGoogle?.();
    } catch (err: any) {
      setError(err?.message || "Não foi possível entrar com o Google.");
    }
  }

  async function handleAppleLogin(identityToken: string, givenName?: string | null, familyName?: string | null) {
    try {
      setError(null);
      await loginWithApple(identityToken, givenName || undefined, familyName || undefined);
    } catch (err: any) {
      if (err instanceof CustomError) {
        if (err.type === "ConflictError") {
          setError("Já existe uma conta associada a esse Apple ID. Por favor, utilize outro método de login.");
          return;
        }
        setError([err.message, err.action].filter(Boolean).join(" "));
      } else {
        setError(err?.message || "Não foi possível entrar com a Apple.");
      }
    }
  }
*/
  function handleGoToForgotPassword() {
    router.push("/forgot-password");
  }

  function handleGoToRegister() {
    router.push("/register");
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo-icon.png")} style={styles.logo} />
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

      {/*}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou se preferir</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.socialContainer}>
        {!isExpoGo && GoogleSigninButtonDynamic && (
          <GoogleSigninButtonDynamic
            style={styles.socialButtonBase}
            size={GoogleSigninButtonDynamic.Size.Wide}
            color={GoogleSigninButtonDynamic.Color.Dark}
            onPress={handleGoogleLogin}
          />
        )}

        {Platform.OS === "ios" && (
          <AppleAuthenticationButton
            buttonType={AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={styles.socialButtonBase}
            onPress={async () => {
              try {
                const credential = await appleSignInAsync({
                  requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
                });
                console.log(credential);
                await handleAppleLogin(credential.identityToken!, credential.fullName?.givenName, credential.fullName?.familyName);
              } catch (e: any) {
                if (e.code === "ERR_REQUEST_CANCELED") {
                } else {
                  setError("Não foi possível entrar com a Apple.");
                }
              }
            }}
          />
        )}
      </View>
      */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Esqueceu sua senha? </Text>
        <TouchableOpacity onPress={handleGoToForgotPassword}>
          <Text style={styles.registerLink}>Recuperar senha</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={handleGoToRegister}>
          <Text style={styles.registerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  dividerText: {
    color: "#fee685",
    marginHorizontal: 8,
    fontSize: 13,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(254, 202, 202, 0.6)",
  },
  socialContainer: {
    marginBottom: 8,
  },
  socialButtonBase: {
    paddingHorizontal: 10,
    width: "100%",
    height: 44,
    marginTop: 10,
    borderRadius: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  registerLink: {
    color: "#fee685",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
