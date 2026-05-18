import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

// import format from "date-fns/format";
import format from "date-fns/format";

import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ptBR from "date-fns/locale/pt-BR";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AgendaMedico.css";

import {
  buscarSlotsMedico,
  criarSlot,
  cancelarSlot,
} from "../../services/slotService";

import { getUsuarioId } from "../../utils/jwt";

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

export default function AgendaMedico() {
  const [eventos, setEventos] = useState([]);

  const medicoId = getUsuarioId();

  async function carregarSlots() {
    try {
      const slots = await buscarSlotsMedico(medicoId);

      const eventosConvertidos = slots.map((slot) => ({
        id: slot.id,
        title: slot.status,
        start: new Date(slot.dataHoraInicio),
        end: new Date(slot.dataHoraFim),
        status: slot.status,
      }));

      setEventos(eventosConvertidos);
    } catch (err) {
      console.error("Erro ao carregar slots:", err);
      alert("Erro ao carregar agenda.");
    }
  }

  useEffect(() => {
    carregarSlots();
  }, []);

  async function handleSelectSlot({ start, end }) {
    const confirmar = window.confirm(
      `Criar horário de ${start.toLocaleString()} até ${end.toLocaleString()} ?`,
    );

    if (!confirmar) return;

    try {
      await criarSlot({
        medicoId,
        dataHoraInicio: start,
        dataHoraFim: end,
      });

      await carregarSlots();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar slot.");
    }
  }

  async function handleSelectEvent(event) {
    if (event.status !== "LIVRE") {
      alert("Apenas slots LIVRES podem ser cancelados.");
      return;
    }

    const confirmar = window.confirm("Deseja cancelar este horário?");

    if (!confirmar) return;

    try {
      await cancelarSlot(event.id);
      await carregarSlots();
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar slot.");
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
        padding: "4px",
      },
    };
  }

  return (
    <div className="agenda-container">
      <h1>Minha Agenda</h1>

      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: "80vh" }}
        views={["month", "week", "day"]}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
        }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}
