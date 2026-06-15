import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AgendaMedico.css";
import "./AgendaAtendente.css";
import api from "../../api/api";
import { buscarSlotsMedico } from "../../services/slotServices";
import { listarMedicos } from "../../services/medicoServices";

const locales = { "pt-BR": ptBR };

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
  // const [eventos, setEventos] = useState([]);
  const [slots, setSlots] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [pacienteId, setPacienteId] = useState("");
  const [salvando, setSalvando] = useState(false);

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

  function getSlotDoBloco(blocoDate) {
    return slots.find((slot) => {
      const inicio = new Date(slot.dataHoraInicio);
      const fim = new Date(slot.dataHoraFim);

      return blocoDate >= inicio && blocoDate < fim;
    });
  }

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

  function handleSelectSlot(slotInfo) {
    const slot = getSlotDoBloco(slotInfo.start);

    if (!slot) return;

    if (slot.status !== "LIVRE") {
      alert("Este horário não está disponível.");
      return;
    }

    setSlotSelecionado({
      start: new Date(slot.dataHoraInicio),
      end: new Date(slot.dataHoraFim),
      slotId: slot.id,
      status: slot.status,
    });

    setPacienteId("");
    setModalAberto(true);
  }

  useEffect(() => {
    carregarMedicos();
    carregarPacientes();
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

  async function carregarPacientes() {
    try {
      const res = await api.get("/pacientes");
      setPacientes(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  // async function carregarAgenda(medicoId) {
  //   try {
  //     const slots = await buscarSlotsMedico(medicoId);
  //     const eventosConvertidos = slots.map((slot) => ({
  //       id: slot.id,
  //       title:
  //         slot.status === "LIVRE"
  //           ? "Disponível"
  //           : slot.status === "OCUPADO"
  //             ? "Ocupado"
  //             : "Cancelado",
  //       start: new Date(slot.dataHoraInicio),
  //       end: new Date(slot.dataHoraFim),
  //       status: slot.status,
  //       slotId: slot.id,
  //     }));
  //     setEventos(eventosConvertidos);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Erro ao carregar agenda do médico.");
  //   }
  // }
  async function carregarAgenda(medicoId) {
    try {
      const dados = await buscarSlotsMedico(medicoId);
      setSlots(dados);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar agenda.");
    }
  }
  function handleSelecionarMedico(e) {
    const id = e.target.value;
    setMedicoSelecionado(id);
    if (id) carregarAgenda(id);
    else setEventos([]);
  }

  // Clique em evento do calendário
  function handleSelectEvent(event) {
    if (event.status !== "LIVRE") {
      alert("Este horário não está disponível para agendamento.");
      return;
    }
    setSlotSelecionado(event);
    setPacienteId("");
    setModalAberto(true);
  }

  async function confirmarAgendamento() {
    if (!pacienteId) {
      alert("Selecione um paciente.");
      return;
    }

    const funcionarioId = localStorage.getItem("id");
    if (!funcionarioId) {
      alert("Sessão inválida. Faça login novamente.");
      return;
    }

    try {
      setSalvando(true);
      await api.post("/consultas", {
        slotId: slotSelecionado.slotId,
        pacienteId: parseInt(pacienteId),
        funcionarioId: parseInt(funcionarioId),
        tipo: "CONSULTA",
        preco: 0,
      });

      setModalAberto(false);
      setSlotSelecionado(null);
      setPacienteId("");
      await carregarAgenda(medicoSelecionado);
    } catch (err) {
      console.error(err);
      alert("Erro ao realizar agendamento. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function eventStyleGetter(event) {
    let backgroundColor = "#888";
    if (event.status === "LIVRE") backgroundColor = "#2ecc71";
    if (event.status === "OCUPADO") backgroundColor = "#3498db";
    if (event.status === "CANCELADO") backgroundColor = "#7f8c8d";

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        border: "none",
        color: "white",
        cursor: event.status === "LIVRE" ? "pointer" : "default",
      },
    };
  }

  const medicoNome =
    medicos.find((m) => m.id === parseInt(medicoSelecionado))?.nome || "";

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
        <>
          <Calendar
            localizer={localizer}
            events={[]}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "85vh" }}
            views={["week", "day"]}
            defaultView="week"
            selectable
            popup
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
            onSelectSlot={handleSelectSlot}
          />
          {/* Legenda */}
          <div
            style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 14 }}
          >
            <span>
              <span style={{ color: "#2ecc71", fontWeight: 700 }}>●</span>{" "}
              Disponível — clique para agendar
            </span>
            <span>
              <span style={{ color: "#3498db", fontWeight: 700 }}>●</span>{" "}
              Ocupado
            </span>
            <span>
              <span style={{ color: "#7f8c8d", fontWeight: 700 }}>●</span>{" "}
              Cancelado
            </span>
          </div>
        </>
      )}

      {/* Modal de agendamento */}
      {modalAberto && slotSelecionado && (
        <div className="modal-overlay">
          <div className="modal-agenda">
            <h2>Novo Agendamento</h2>

            <div className="campo-modal">
              <label>Horário</label>
              <input
                type="text"
                readOnly
                value={`${format(slotSelecionado.start, "dd/MM/yyyy HH:mm")} → ${format(slotSelecionado.end, "HH:mm")}`}
                style={{ background: "#f4f7fb", cursor: "default" }}
              />
            </div>

            <div className="campo-modal">
              <label>Médico</label>
              <input
                type="text"
                readOnly
                value={medicoNome}
                style={{ background: "#f4f7fb", cursor: "default" }}
              />
            </div>

            <div className="campo-modal">
              <label>Paciente</label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: 15,
                }}
              >
                <option value="">-- Selecione um paciente --</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} {p.cpf ? `— ${p.cpf}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="botoes-modal">
              <button
                className="btn-confirmar"
                onClick={confirmarAgendamento}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Confirmar"}
              </button>
              <button
                className="btn-cancelar"
                onClick={() => {
                  setModalAberto(false);
                  setSlotSelecionado(null);
                  setPacienteId("");
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
