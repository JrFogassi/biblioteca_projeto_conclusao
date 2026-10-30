import { use, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    try {
      await login(email, senha);
      navigate("/livros");
    } catch {
      setErro("E-mail ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Biblioteca</h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
        <Link
          to="/cadastro"
          className="block text-center text-sm text-blue-600"
        >
          Criar conta
        </Link>
      </form>
    </div>
  );
}
