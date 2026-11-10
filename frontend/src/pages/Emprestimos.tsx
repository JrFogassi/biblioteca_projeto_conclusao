import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

interface Emprestimo {
  id: number;
  livro: { id: number; titulo: string; autor: string };
  dataRetirada: string;
  dataPrevistaDevolucao: string;
  dataDevolucao: string | null;
  status: "ATIVO" | "DEVOLVIDO" | "ATRASADO";
}

function formarData(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function situacao(e: Emprestimo) {
  if (e.dataDevolucao) {
    return e.status === "ATRASADO" ? "Devolvido com atraso" : "Devolvido";
  }
  const hoje = new Date().toLocaleDateString("en-CA");
  return e.dataPrevistaDevolucao < hoje ? "Atrasado" : "Em andamento";
}

export default function Emprestimo() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [erro, setErro] = useState("");

  function carregar() {
    api
      .get<Emprestimo[]>("/emprestimos/meus")
      .then((res) => setEmprestimos(res.data));
  }

  useEffect(() => {
    api
      .get<Emprestimo[]>("/emprestimos/meus")
      .then((res) => setEmprestimos(res.data));
  }, []);

  async function devolver(id: number) {
    setErro("");
    try {
      await api.put(`/emprestimos/${id}/devolver`);
      carregar();
    } catch {
      setErro("Não foi possível devolver o livro.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Meus empréstimos</h1>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        {emprestimos.length === 0 && (
          <p className="text-gray-500">
            Você ainda não pegou nenhum livro emprestado.
          </p>
        )}

        <ul className="space-y-2">
          {emprestimos.map((e) => (
            <li
              key={e.id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <strong>{e.livro.titulo}</strong> - {e.livro.autor}
                <div className="text-sm text-gray-500">
                  Retirado em {formarData(e.dataRetirada)} · Devolver até{" "}
                  {formarData(e.dataPrevistaDevolucao)}
                  {e.dataDevolucao &&
                    `· Devolvido em ${formarData(e.dataDevolucao)}`}
                </div>
                <div className="text-sm font-medium">{situacao(e)}</div>
              </div>
              {!e.dataDevolucao && (
                <button
                  onClick={() => devolver(e.id)}
                  className="text-sm text-blue-600"
                >
                  Devolver
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
