import { use, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
}

type LivroForm = Omit<Livro, "id" | "quantidadeDisponivel">;

const formVazio: LivroForm = {
  titulo: "",
  autor: "",
  isbn: "",
  categoria: "",
  quantidadeTotal: 1,
};

export default function Livros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [form, setForm] = useState<LivroForm>(formVazio);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const { logout } = useAuth();

  function carregar() {
    api.get<Livro[]>("/livros").then((res) => setLivros(res.data));
  }

  useEffect(() => {
    api.get<Livro[]>("/livros").then((res) => setLivros(res.data));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/livros/${editandoId}`, form);
      } else {
        await api.post("/livros", form);
      }
      cancelar();
      carregar();
    } catch {
      setErro(
        "Não foi possível salvar. Verifique se o ISBN já está cadastrado",
      );
    }
  }

  function editar(livro: Livro) {
    setForm({
      titulo: livro.titulo,
      autor: livro.autor,
      isbn: livro.isbn,
      categoria: livro.categoria,
      quantidadeTotal: livro.quantidadeTotal,
    });
    setEditandoId(livro.id);
  }

  function cancelar() {
    setForm(formVazio);
    setEditandoId(null);
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este livro?")) return;
    try {
      await api.delete(`/livros/${id}`);
      carregar();
    } catch {
      setErro(
        "Não foi possível excluir (o livro pode ter empréstimos vinculados).",
      );
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Livros</h1>
        <button onClick={logout} className="text-sm text-red-600">
          Sair
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow grid grid-cols-2 gap-3"
      >
        <h2 className="col-span-2 font-semibold">
          {editandoId ? "Editar livro" : "Novo livro"}
        </h2>

        <input
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
      </form>
    </div>
  );

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
