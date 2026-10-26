import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  quantidadeDisponivel: number;
}

export default function Livros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    api.get<Livro[]>("/livros").then((res) => setLivros(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Livros</h1>
        <button onClick={logout} className="text-sm text-red-600">
          Sair
        </button>
      </div>
      <ul className="space-y-2">
        {livros.map((l) => (
          <li key={l.id} className="bg-white p-3 rounded shadow">
            <strong>{l.titulo}</strong> - {l.autor} ({l.quantidadeDisponivel}{" "}
            disponíveis)
          </li>
        ))}
      </ul>
    </div>
  );
}
