import { clearTokens, saveTokens } from "../storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
    });

    const data: LoginResponse = await res.json();
    if (!res.ok) {
      if (data && (data as any).message) {
        throw new Error((data as any).message);
      }
      throw new Error("Credenciais inválidas");
    }

    await saveTokens(data.access_token, data.refresh_token);

    return data.user;
  } catch (err) {
    if (err instanceof TypeError && err.message === "Network request failed") {
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão com a internet.");
    }
    throw err;
  }
}

export async function logout() {
  await clearTokens();
}
