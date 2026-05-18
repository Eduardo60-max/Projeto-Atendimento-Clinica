import api from "../api/api";

export async function buscarSlotsMedico(medicoId) {
  const response = await api.get(`/slots/medico/${medicoId}`);
  return response.data;
}

export async function criarSlot(slot) {
  const response = await api.post("/slots", slot);
  return response.data;
}

export async function cancelarSlot(id) {
  const response = await api.put(`/slots/${id}/cancelar`);
  return response.data;
}
