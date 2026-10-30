import { use, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmar) {
      setErro("As senhas não coincidem");
      return;
    }

    try {
      await api.post("/usuarios", { nome, email, senha });
      await login(email, senha);
      navigate("/livros");
    } catch {
      setErro("Não foi possível criar a conta. Tente outro e-mail.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Criar conta</h1>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
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
          placeholder="Senha (mínimo 6 caracterers)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border rounded px-3 py-2"
          minLength={6}
          required
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>

        <Link to="/login" className="block text-center text-sm text-blue-600">
          Já possuo conta
        </Link>
      </form>
    </div>
  );
}
