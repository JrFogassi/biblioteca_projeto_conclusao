import { isAxiosError } from "axios";

export function mensagemDeErro(
  err: unknown,
  padrao: string,
  conflito?: string,
): string {
  if (isAxiosError(err)) {
    if (!err.response) {
      return "Sem conexão com o servidor. O backend está rodando?";
    }
    const status = err.response.status;
    if (status === 403) {
      return "Você não tem permissão para fazer isso.";
    }
    if (status === 409 && conflito) {
      return conflito;
    }
    return `${padrao} (erro ${status})`;
  }

  return padrao;
}
