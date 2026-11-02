import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { mensagemDeErro } from "../services/erros";

interface Multa {
  id: number;
  valor: number;
  paga: boolean;
  dataGeracao: string;
  emprestimo: {
    livro: { titulo: string };
    usuario: { nome: string };
  };
}

function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Multas() {
  const [multas, setMultas] = useState<Multa[]>([]);
  const [erro, setErro] = useState("");
  const { usuario } = useAuth();
  const ehBibliotecario = usuario?.papel === "BIBLIOTECARIO";

  function carregar() {
    api
      .get<Multa[]>("/multas")
      .then((res) => setMultas(res.data))
      .catch((err) =>
        setErro(mensagemDeErro(err, "Não foi possível carregar as multas.")),
      );
  }

  useEffect(() => {
    api
      .get<Multa[]>("/multas")
      .then((res) => setMultas(res.data))
      .catch((err) =>
        setErro(mensagemDeErro(err, "Não foi possível carregar as multas")),
      );
  }, []);

  async function pagar(id: number) {
    setErro("");
    try {
      await api.put(`/multas/${id}/pagar`);
      carregar();
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível registrar o pagamento."));
    }
  }

  const totalPendente = multas
    .filter((m) => !m.paga)
    .reduce((soma, m) => soma + m.valor, 0);

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Multas</h1>

        <p className="text-sm text-gray-600">
          Total pendente: <strong>{formatarValor(totalPendente)}</strong>
        </p>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        {multas.length === 0 && (
          <p className="text-gray-500">Nenhuma multa registrada</p>
        )}

        <ul className="space-y-2">
          {multas.map((m) => (
            <li
              key={m.id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <strong>{m.emprestimo.livro.titulo}</strong>
                {ehBibliotecario && `- ${m.emprestimo.usuario.nome}`}
                <div className="text-sm text-gray-500">
                  Gerada em {formatarData(m.dataGeracao)} ·{" "}
                  {formatarValor(m.valor)}
                </div>
                <div
                  className={`text-sm font-medium ${m.paga ? "text-green-700" : "text-red-600"}`}
                >
                  {m.paga ? "Paga" : "Pendente"}
                </div>
              </div>
              {ehBibliotecario && !m.paga && (
                <button
                  onClick={() => pagar(m.id)}
                  className="text-sm text-blue-600"
                >
                  Registrar pagamento
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
