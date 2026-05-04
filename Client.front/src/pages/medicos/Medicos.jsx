import "./medicos.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Medicos() {
  const [busca, setBusca] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  const [novoMedico, setNovoMedico] = useState({
    nome: "",
    telefone: "",
    crm: "",
    especialidade: "",
    salario: "",
  });

  useEffect(() => {
    setCarregando(true);

    axios
      .get("http://localhost:8080/api/medicos")
      .then((res) => {
        const medicosUnicos = Array.from(
          new Map(res.data.map((m) => [m.id, m])).values(),
        );

        setMedicos(medicosUnicos);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar médicos:", err);
        setCarregando(false);
      });
  }, []);

  const filtrados = medicos.filter(
    (m) =>
      m.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      m.crm?.toLowerCase().includes(busca.toLowerCase()) ||
      m.especialidade?.toLowerCase().includes(busca.toLowerCase()) ||
      m.telefone?.toLowerCase().includes(busca.toLowerCase()),
  );

  const { dados: medicosPaginados, totalPaginas } = paginar(
    filtrados,
    paginaAtual,
    itensPorPagina,
  );

  async function deletarMedico(id) {
    try {
      await axios.delete(`http://localhost:8080/api/medicos/${id}`);
      setMedicos((prev) => prev.filter((m) => m.id !== id));
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

  async function criarMedico(e) {
    e.preventDefault();

    console.log("Enviando JSON:", novoMedico);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/medicos",
        novoMedico,
      );

      setMedicos((prev) => [...prev, res.data]);

      setNovoMedico({
        nome: "",
        telefone: "",
        crm: "",
        especialidade: "",
        salario: "",
      });

      setMostrarModal(false);
    } catch (err) {
      console.error("Erro ao criar médico:", err);
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
    <div className="pacientes-container">
      <h1>Médicos</h1>
      <p>Lista de médicos cadastrados no sistema.</p>

      <input
        type="text"
        placeholder="Buscar por nome, CRM, especialidade ou telefone..."
        className="pacientes-busca"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPaginaAtual(1);
        }}
      />

      <button className="button-add" onClick={() => setMostrarModal(true)}>
        + Adicionar Médico
      </button>

      {carregando ? (
        <p>Carregando médicos...</p>
      ) : (
        <div className="pacientes-lista">
          {filtrados.length === 0 ? (
            <p>Nenhum médico encontrado.</p>
          ) : (
            medicosPaginados.map((m) => (
              <div key={m.id} className="paciente-card">
                <h2>{m.nome}</h2>

                <p>
                  <strong>ID:</strong> {m.id || "Não informado"}
                </p>
                <p>
                  <strong>CRM:</strong> {m.crm || "Não informado"}
                </p>
                <p>
                  <strong>Especialidade:</strong>{" "}
                  {m.especialidade || "Não informada"}
                </p>
                <p>
                  <strong>Telefone:</strong> {m.telefone || "Não informado"}
                </p>
                <p>
                  <strong>Salário:</strong> R$ {m.salario || "0,00"}
                </p>

                <button
                  className="button-delete-paciente"
                  onClick={() => deletarMedico(m.id)}
                >
                  Deletar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* muldqal */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Novo Médico</h2>

            <form onSubmit={criarMedico} className="form-paciente">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nome"
                  value={novoMedico.nome}
                  onChange={(e) =>
                    setNovoMedico({ ...novoMedico, nome: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Telefone"
                  value={novoMedico.telefone}
                  onChange={(e) =>
                    setNovoMedico({ ...novoMedico, telefone: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="CRM"
                  value={novoMedico.crm}
                  onChange={(e) =>
                    setNovoMedico({ ...novoMedico, crm: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Especialidade"
                  value={novoMedico.especialidade}
                  onChange={(e) =>
                    setNovoMedico({
                      ...novoMedico,
                      especialidade: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Salário"
                  value={novoMedico.salario}
                  onChange={(e) =>
                    setNovoMedico({ ...novoMedico, salario: e.target.value })
                  }
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

export default Medicos;
