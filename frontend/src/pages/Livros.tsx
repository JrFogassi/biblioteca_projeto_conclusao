import { useEffect, useState, type FormEvent } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { mensagemDeErro } from "../services/erros";

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
  const [mensagem, setMensagem] = useState("");
  const { usuario } = useAuth();
  const ehBibliotecario = usuario?.papel === "BIBLIOTECARIO";

  function carregar() {
    api
      .get<Livro[]>("/livros")
      .then((res) => setLivros(res.data))
      .catch((err) =>
        setErro(mensagemDeErro(err, "Não foi possível carregar os livros.")),
      );
  }

  useEffect(() => {
    api
      .get<Livro[]>("/livros")
      .then((res) => setLivros(res.data))
      .catch((err) =>
        setErro(mensagemDeErro(err, "Não foi possível carregar os livros")),
      );
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    try {
      if (editandoId) {
        await api.put(`/livros/${editandoId}`, form);
      } else {
        await api.post("/livros", form);
      }
      cancelar();
      carregar();
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível salvar o livro"));
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
    setErro("");
    setMensagem("");
    try {
      await api.delete(`/livros/${id}`);
      carregar();
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível excluir o livro."));
    }
  }

  async function emprestar(id: number) {
    setErro("");
    setMensagem("");
    try {
      await api.post("/emprestimos", null, { params: { livroId: id } });
      setMensagem(
        "Empréstimo realizado! A devolução está prevista para daqui a 7 dias.",
      );
      carregar();
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível emprestar este livro"));
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Livros</h1>

        {ehBibliotecario && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow grid grid-cols-2 gap-3"
          >
            <h2 className="cols-span-2 font-semibold">
              {editandoId ? "Editar livro" : "Novo livro"}
            </h2>

            <input
              placeholder="Título"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              placeholder="Autor"
              value={form.autor}
              onChange={(e) => setForm({ ...form, autor: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              placeholder="ISBN"
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              placeholder="Categoria"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              min={1}
              placeholder="Quantidade"
              value={form.quantidadeTotal}
              onChange={(e) =>
                setForm({ ...form, quantidadeTotal: Number(e.target.value) })
              }
              className="border rounded px-3 py-2"
              required
            />

            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editandoId ? "Salvar alterações" : "Cadastrar"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={cancelar}
                  className="px-4 py-2 rounded border"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}

        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        {mensagem && <p className="text-green-700 text-sm">{mensagem}</p>}

        <ul className="space-y-2">
          {livros.map((l) => (
            <li
              key={l.id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <strong>{l.titulo}</strong> — {l.autor}
                <div className="text-sm text-gray-500">
                  {l.categoria} · ISBN {l.isbn} · {l.quantidadeDisponivel}/
                  {l.quantidadeTotal} disponíveis
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => emprestar(l.id)}
                  disabled={l.quantidadeDisponivel === 0}
                  className="text-green-700 disabled:text-gray-400"
                >
                  Emprestar
                </button>
                {ehBibliotecario && (
                  <>
                    <button onClick={() => editar(l)} className="text-blue-600">
                      Editar
                    </button>
                    <button
                      onClick={() => excluir(l.id)}
                      className="text-red-600"
                    >
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
