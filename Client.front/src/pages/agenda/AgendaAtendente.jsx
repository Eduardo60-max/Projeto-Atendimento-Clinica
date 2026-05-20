import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { ptBR } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AgendaMedico.css";

import { buscarSlotsMedico } from "../../services/slotServices";
import { listarMedicos } from "../../services/medicoServices";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export default function AgendaAtendente() {
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState("");
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    carregarMedicos();
  }, []);

  async function carregarMedicos() {
    try {
      const dados = await listarMedicos();
      setMedicos(dados);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar médicos.");
    }
  }

  async function carregarAgenda(medicoId) {
    try {
      const slots = await buscarSlotsMedico(medicoId);

      const eventosConvertidos = slots.map((slot) => ({
        id: slot.id,
        title:
          slot.status === "LIVRE"
            ? "Disponível"
            : slot.status === "OCUPADO"
              ? "Ocupado"
              : "Cancelado",
        start: new Date(slot.dataHoraInicio),
        end: new Date(slot.dataHoraFim),
        status: slot.status,
      }));
      setEventos(eventosConvertidos);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar agenda do médico.");
    }
  }

  function handleSelecionarMedico(e) {
    const id = e.target.value;

    setMedicoSelecionado(id);
    if (id) {
      carregarAgenda(id);
    }
  }

  function eventStyleGetter(event) {
    let backgroundColor = "#888";

    if (event.status === "LIVRE") {
      backgroundColor = "#2ecc71";
    }

    if (event.status === "OCUPADO") {
      backgroundColor = "#3498db";
    }

    if (event.status === "CANCELADO") {
      backgroundColor = "#7f8c8d";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        border: "none",
        color: "white",
      },
    };
  }

  return (
    <div className="agenda-container">
      <h1>Agenda dos Médicos</h1>

      <div className="filtro-medico">
        <label>Selecione um médico:</label>

        <select value={medicoSelecionado} onChange={handleSelecionarMedico}>
          <option value="">Escolha um médico</option>

          {medicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.nome} - {medico.especialidade}
            </option>
          ))}
        </select>
      </div>

      {medicoSelecionado && (
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh" }}
          views={["week", "day"]}
          defaultView="week"
          selectable={false}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          eventPropGetter={eventStyleGetter}
        />
      )}
    </div>
  );
}
