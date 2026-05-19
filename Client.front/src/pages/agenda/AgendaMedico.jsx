import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

// import format from "date-fns/format";
import { format } from "date-fns/format";

import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { ptBR } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AgendaMedico.css";

import {
  buscarSlotsMedico,
  criarSlot,
  cancelarSlot,
} from "../../services/slotServices.js";

import { getUsuarioId } from "../../utils/jwt.js";

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

  const [modalAberto, setModalAberto] = useState(false);

  const [dataSelecionada, setDataSelecionada] = useState(null);

  const [horaInicio, setHoraInicio] = useState("");

  const [horaFim, setHoraFim] = useState("");

  const medicoId = getUsuarioId();

  async function carregarSlots() {
    try {
      const slots = await buscarSlotsMedico(medicoId);

      const eventosConvertidos = slots.map((slot) => ({
        id: slot.id,
        title: `${format(new Date(slot.dataHoraInicio), "HH:mm")} - ${format(
          new Date(slot.dataHoraFim),
          "HH:mm",
        )}`,
        start: new Date(slot.dataHoraInicio),
        end: new Date(slot.dataHoraFim),
        status: slot.status,
      }));

      setEventos(eventosConvertidos);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar agenda.");
    }
  }

  useEffect(() => {
    carregarSlots();
  }, []);

  function handleSelectSlot(slotInfo) {
    setDataSelecionada(slotInfo.start);
    setModalAberto(true);
  }

  async function confirmarCriacao() {
    if (!horaInicio || !horaFim) {
      alert("Preencha os horários.");
      return;
    }

    try {
      const [horaI, minutoI] = horaInicio.split(":");
      const [horaF, minutoF] = horaFim.split(":");

      const inicio = new Date(dataSelecionada);
      // Boa prática: zerar os segundos e milissegundos para evitar "sujeira" na data
      inicio.setHours(horaI, minutoI, 0, 0);

      const fim = new Date(dataSelecionada);
      fim.setHours(horaF, minutoF, 0, 0);

      // Envia a data formatada como string local (ex: "2026-05-18T10:00:00")
      // Isso impede a conversão para UTC (+3h)
      await criarSlot({
        medicoId,
        dataHoraInicio: format(inicio, "yyyy-MM-dd'T'HH:mm:ss"),
        dataHoraFim: format(fim, "yyyy-MM-dd'T'HH:mm:ss"),
      });

      setModalAberto(false);
      setHoraInicio("");
      setHoraFim("");

      await carregarSlots();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar horário.");
    }
  }
  async function handleSelectEvent(event) {
    if (event.status !== "LIVRE") {
      alert("Somente slots livres podem ser cancelados.");
      return;
    }

    const confirmar = window.confirm("Deseja cancelar este horário?");

    if (!confirmar) return;

    try {
      await cancelarSlot(event.id);
      await carregarSlots();
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar.");
    }
  }

  function eventStyleGetter(event) {
    let backgroundColor = "#95a5a6";

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
        fontWeight: "600",
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
        popup
        style={{ height: "85vh" }}
        views={["month", "week", "day"]}
        defaultView="week"
        step={30}
        timeslots={1}
        min={new Date(0, 0, 0, 6, 0, 0)}
        max={new Date(0, 0, 0, 22, 0, 0)}
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

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-agenda">
            <h2>Novo Horário</h2>

            <div className="campo-modal">
              <label>Horário de início</label>

              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>

            <div className="campo-modal">
              <label>Horário de saída</label>

              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
              />
            </div>

            <div className="botoes-modal">
              <button className="btn-confirmar" onClick={confirmarCriacao}>
                Confirmar
              </button>

              <button
                className="btn-cancelar"
                onClick={() => {
                  setModalAberto(false);
                  setHoraInicio("");
                  setHoraFim("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
