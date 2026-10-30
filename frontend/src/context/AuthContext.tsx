import { createContext, useContext, useState, type ReactNode } from "react";
import api from "../services/api";

type Papel = "LEITOR" | "BIBLIOTECARIO";

interface Usuario {
  nome: string;
  papel: Papel;
}

interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function lerUsuario(): Usuario | null {
  try {
    const salvo = localStorage.getItem("usuario");
    return salvo ? (JSON.parse(salvo) as Usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [usuario, setUsuario] = useState<Usuario | null>(lerUsuario());

  async function login(email: string, senha: string) {
    const { data } = await api.post<{
      token: string;
      nome: string;
      papel: Papel;
    }>("/auth/login", {
      email,
      senha,
    });
    const dadosUsuario = {
      nome: data.nome,
      papel: data.papel,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    setToken(data.token);
    setUsuario(dadosUsuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
