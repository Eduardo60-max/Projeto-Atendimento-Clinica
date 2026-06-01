import api from "../api/api";

export async function buscarProntuario(consultaId) {
  const response = await api.get(`/prontuarios/consulta/${consultaId}`);

  return response.data;
}

export async function salvarProntuario(dados) {
  const response = await api.post("/prontuarios", dados);

  return response.data;
}
