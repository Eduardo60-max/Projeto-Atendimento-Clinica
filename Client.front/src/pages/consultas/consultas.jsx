import "./Consultas.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function Consultas() {
  const navigate = useNavigate();

  const [consultas, setConsultas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  // const medicoId = 1;
  const medicoId = 1;

  useEffect(() => {
    carregarConsultas();
  }, []);

  async function carregarConsultas() {
    try {
      setCarregando(true);

      const res = await api.get(`/consultas/medico/${medicoId}`);

      console.log(res.data);

      const unicas = Array.from(
        new Map(res.data.map((c) => [c.id, c])).values(),
      );

      setConsultas(unicas);
    } catch (err) {
      console.error("erro ao carregar consultas:", err);
    } finally {
      setCarregando(false);
    }
  }

  const filtradas = consultas.filter(
    (c) =>
      c.pacienteNome?.toLowerCase().includes(busca.toLowerCase()) ||
      c.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
      c.status?.toLowerCase().includes(busca.toLowerCase()),
  );

  function paginar(lista, paginaAtual, itensPorPagina) {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    return {
      dados: lista.slice(inicio, fim),
      totalPaginas: Math.ceil(lista.length / itensPorPagina),
    };
  }

  const { dados: consultasPaginadas, totalPaginas } = paginar(
    filtradas,
    paginaAtual,
    itensPorPagina,
  );

  async function realizarConsulta(id) {
    const confirmar = window.confirm("Deseja realizar esta consulta?");

    if (!confirmar) return;

    try {
      await api.put(`/consultas/${id}/realizar`);

      carregarConsultas();
    } catch (err) {
      console.error("Erro ao realizar consulta:", err);
    }
  }

  async function cancelarConsulta(id) {
    const confirmar = window.confirm("Deseja cancelar esta consulta?");

    if (!confirmar) return;

    try {
      await api.put(`/consultas/${id}/cancelar`);

      carregarConsultas();
    } catch (err) {
      console.error("Erro ao cancelar consulta:", err);
    }
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function formatarHora(data) {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="consultas">
      <h1>Consultas</h1>

      <p>Lista de consultas vinculadas ao médico.</p>

      <input
        type="text"
        placeholder="Buscar por paciente, tipo ou status"
        className="consultas-busca"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPaginaAtual(1);
        }}
      />

      {carregando ? (
        <p>Carregando consultas...</p>
      ) : (
        <div className="consultas-lista">
          {filtradas.length === 0 ? (
            <p>Nenhuma consulta encontrada.</p>
          ) : (
            consultasPaginadas.map((c) => (
              <div key={c.id} className="consulta-cartao">
                <h2>{c.pacienteNome}</h2>

                <p>
                  <strong>Data:</strong> {formatarData(c.slot.dataHoraInicio)}
                </p>

                <p>
                  <strong>Hora:</strong> {formatarHora(c.slot.dataHoraInicio)}
                </p>

                <p>
                  <strong>Tipo:</strong> {c.tipo}
                </p>

                <p>
                  <strong>Preço:</strong> R$ {c.preco}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </p>

                <div className="buttonsConsulta">
                  {c.status === "AGENDADO" && (
                    <>
                      <button
                        className="btn-realizar"
                        onClick={() => realizarConsulta(c.id)}
                      >
                        Realizar
                      </button>

                      <button
                        className="btn-cancelar"
                        onClick={() => cancelarConsulta(c.id)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {c.status === "REALIZADO" && (
                    <button
                      className="btn-prontuario"
                      onClick={() => navigate(`/prontuario/${c.id}`)}
                    >
                      Ver Prontuário
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="paginacao">
        <button
          onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
          disabled={paginaAtual === 1}
        >
          Anterior
        </button>

        <span>
          Página {paginaAtual} de {totalPaginas || 1}
        </span>

        <button
          onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas || totalPaginas === 0}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Consultas;
