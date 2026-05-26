import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

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

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AgendaMedico() {
  // slots brutos do backend (com dataHoraInicio, dataHoraFim, status)
  const [slots, setSlots] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  // slot clicado para cancelar
  const [slotClicado, setSlotClicado] = useState(null);

  const medicoId = getUsuarioId();

  async function carregarSlots() {
    try {
      const dados = await buscarSlotsMedico(medicoId);
      setSlots(dados);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar agenda.");
    }
  }

  useEffect(() => {
    carregarSlots();
  }, []);

  // Verifica se um bloquinho de tempo está dentro de algum slot e retorna o status
  function getStatusDoBloco(blocoDate) {
    for (const slot of slots) {
      const inicio = new Date(slot.dataHoraInicio);
      const fim = new Date(slot.dataHoraFim);
      if (blocoDate >= inicio && blocoDate < fim) {
        return slot.status;
      }
    }
    return null;
  }

  // Retorna o slot que contém aquele bloco de tempo
  function getSlotDoBloco(blocoDate) {
    return slots.find((slot) => {
      const inicio = new Date(slot.dataHoraInicio);
      const fim = new Date(slot.dataHoraFim);
      return blocoDate >= inicio && blocoDate < fim;
    });
  }

  // Colore os bloquinhos de 30min do calendário
  function slotPropGetter(date) {
    const status = getStatusDoBloco(date);

    if (status === "LIVRE") {
      return {
        style: {
          backgroundColor: "#d5f5e3",
          borderTop: "1px solid #2ecc71",
        },
      };
    }

    if (status === "OCUPADO") {
      return {
        style: {
          backgroundColor: "#d6eaf8",
          borderTop: "1px solid #3498db",
        },
      };
    }

    if (status === "CANCELADO") {
      return {
        style: {
          backgroundColor: "#f2f3f4",
          borderTop: "1px solid #aab7b8",
        },
      };
    }

    return {};
  }

  // Clique numa área vazia → abre modal para criar slot
  function handleSelectSlot(slotInfo) {
    setDataSelecionada(slotInfo.start);
    setModalAberto(true);
  }

  // Clique num bloco colorido → pergunta se quer cancelar (só LIVRE)
  function handleClickSlot(slotInfo) {
    const slot = getSlotDoBloco(slotInfo.start);
    if (!slot) return;

    if (slot.status !== "LIVRE") {
      alert("Somente slots livres podem ser cancelados.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja cancelar o horário ${format(new Date(slot.dataHoraInicio), "HH:mm")} - ${format(new Date(slot.dataHoraFim), "HH:mm")}?`
    );

    if (!confirmar) return;

    cancelarSlot(slot.id)
      .then(() => carregarSlots())
      .catch((err) => {
        console.error(err);
        alert("Erro ao cancelar.");
      });
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
      inicio.setHours(horaI, minutoI, 0, 0);

      const fim = new Date(dataSelecionada);
      fim.setHours(horaF, minutoF, 0, 0);

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

  return (
    <div className="agenda-container">
      <h1>Minha Agenda</h1>

      {/* Legenda */}
      <div style={{ display: "flex", gap: 20, marginBottom: 16, fontSize: 14 }}>
        <span><span style={{ color: "#2ecc71", fontWeight: 700 }}>●</span> Livre</span>
        <span><span style={{ color: "#3498db", fontWeight: 700 }}>●</span> Ocupado</span>
        <span><span style={{ color: "#aab7b8", fontWeight: 700 }}>●</span> Cancelado</span>
      </div>

      <Calendar
        localizer={localizer}
        events={[]} // sem eventos por cima — a cor fica nos bloquinhos
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
        slotPropGetter={slotPropGetter}
        onSelectSlot={(slotInfo) => {
          const slot = getSlotDoBloco(slotInfo.start);
          if (slot) {
            // clicou num bloco que já tem slot → pergunta se cancela
            handleClickSlot(slotInfo);
          } else {
            // clicou numa área livre → abre modal para criar
            handleSelectSlot(slotInfo);
          }
        }}
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
