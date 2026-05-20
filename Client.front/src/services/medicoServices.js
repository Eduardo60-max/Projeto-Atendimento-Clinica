import api from "../api/api";

export async function listarMedicos() {
  const response = await api.get("/medicos");
  return response.data;
}
