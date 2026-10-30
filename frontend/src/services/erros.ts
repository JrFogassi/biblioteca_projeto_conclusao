import { isAxiosError } from "axios";

export function mensagemDeErro(err: unknown, padrao: string): string {
  if (isAxiosError(err)) {
    if (!err.response) {
      return "Sem conexão com o servidor. O backend está rodando?";
    }
    if (err.response.status === 401 || err.response.status === 403) {
      return "Sem permissão ou sessão expirada. Saia e entre novamente.";
    }
    return `${padrao} (erro ${err.response.status})`;
  }

  return padrao;
}
