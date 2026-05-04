import "./atendimentos.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Atendimentos() {
  const [busca, setBusca] = useState("");
  const [atendimentos, setAtendimentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  const [novoAgendamento, setNovoAgendamento] = useState({
    descricao: "",
    tipo: "",
    preco: "",
    dataHora: "",
    medicoId: "",
    pacienteId: "",
    funcionarioId: "",
  });

  useEffect(() => {
    setCarregando(true);

    axios
      .get("http://localhost:8080/api/atendimentos")
      .then((res) => {
        const unicos = Array.from(
          new Map(res.data.map((a) => [a.id, a])).values(),
        );
        setAtendimentos(unicos);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar atendimentos:", err);
        setCarregando(false);
      });
  }, []);

  const filtrados = atendimentos.filter((a) => {
    const b = busca.toLowerCase();
    return (
      a.descricao.toLowerCase().includes(b) ||
      a.tipo.toLowerCase().includes(b) ||
      a.status.toLowerCase().includes(b) ||
      a.medico?.nome.toLowerCase().includes(b) ||
      a.paciente?.nome.toLowerCase().includes(b)
    );
  });

  const { dados: atendimentosPaginados, totalPaginas } = paginar(
    filtrados,
    paginaAtual,
    itensPorPagina,
  );

  async function deletarAtendimento(id) {
    try {
      await axios.delete(`http://localhost:8080/api/atendimentos/${id}`);
      setAtendimentos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      if (err.response?.status === 404) {
        alert(
          "Não é possível excluir este médico porque existem pacientes ou atendimentos associados.",
        );
      } else {
        alert("Erro inesperado ao excluir médico.");
      }
    }
  }

  async function criarAtendimento(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/agendamentos", {
        medicoId: parseInt(novoAgendamento.medicoId),
        pacienteId: parseInt(novoAgendamento.pacienteId),
        funcionarioId: parseInt(novoAgendamento.funcionarioId),
        descricao: novoAgendamento.descricao,
        tipo: novoAgendamento.tipo,
        preco: parseFloat(novoAgendamento.preco),
        dataHora: novoAgendamento.dataHora,
      });

      setAtendimentos((prev) => [...prev, res.data.atendimento]);

      setNovoAgendamento({
        descricao: "",
        tipo: "",
        preco: "",
        dataHora: "",
        medicoId: "",
        pacienteId: "",
        funcionarioId: "",
      });

      setMostrarModal(false);
    } catch (err) {
      console.error("Erro ao criar atendimento:", err);
    }
  }

  function paginar(lista, paginaAtual, itensPorPagina) {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    return {
      dados: lista.slice(inicio, fim),
      totalPaginas: Math.ceil(lista.length / itensPorPagina),
    };
  }

  return (
    <div className="atendimentos-container">
      <h1>Atendimentos</h1>
      <p>Lista de atendimentos cadastrados no sistema.</p>

      <input
        type="text"
        placeholder="Buscar por descrição, tipo, status, médico ou paciente..."
        className="atendimentos-busca"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <button className="button-add" onClick={() => setMostrarModal(true)}>
        + Adicionar Atendimento
      </button>

      {carregando ? (
        <p>Carregando atendimentos...</p>
      ) : (
        <div className="atendimentos-lista">
          {filtrados.length === 0 ? (
            <p>Nenhum atendimento encontrado.</p>
          ) : (
            atendimentosPaginados.map((a) => (
              <div key={a.id} className="atendimento-card">
                <h2>{a.descricao}</h2>

                <p>
                  <strong>Tipo:</strong> {a.tipo}
                </p>
                <p>
                  <strong>Preço:</strong> R$ {a.preco.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {a.status}
                </p>
                <p>
                  <strong>Médico:</strong> {a.medico?.nome || "N/A"}
                </p>
                <p>
                  <strong>Paciente:</strong> {a.paciente?.nome || "N/A"}
                </p>

                <button
                  className="button-delete-atendimento"
                  onClick={() => deletarAtendimento(a.id)}
                >
                  Deletar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Novo Atendimento</h2>

            <form onSubmit={criarAtendimento} className="form-atendimento">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Descrição"
                  value={novoAgendamento.descricao}
                  onChange={(e) => {
                    setNovoAgendamento({
                      ...novoAgendamento,
                      descricao: e.target.value,
                    });
                    setPaginaAtual(1);
                  }}
                  required
                />

                <input
                  type="text"
                  placeholder="Tipo"
                  value={novoAgendamento.tipo}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      tipo: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Preço"
                  value={novoAgendamento.preco}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      preco: e.target.value,
                    })
                  }
                />

                {}
                <input
                  type="datetime-local"
                  value={novoAgendamento.dataHora}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      dataHora: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="ID do Médico"
                  value={novoAgendamento.medicoId}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      medicoId: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="ID do Paciente"
                  value={novoAgendamento.pacienteId}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      pacienteId: e.target.value,
                    })
                  }
                  required
                />

                {}
                <input
                  type="text"
                  placeholder="ID do Funcionário"
                  value={novoAgendamento.funcionarioId}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      funcionarioId: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="buttons">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
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
          Página {paginaAtual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Atendimentos;
