import "./pacientes.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Pacientes() {
  const [busca, setBusca] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  const [medicos, setMedicos] = useState([]);
  const [novoPaciente, setNovoPaciente] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    dataNascimento: "",
    sexo: "",
    medico: { id: null },
  });

  useEffect(() => {
    setCarregando(true);

    Promise.all([
      axios.get("http://localhost:8080/api/pacientes"),
      axios.get("http://localhost:8080/api/medicos"),
    ])
      .then(([resPacientes, resMedicos]) => {
        // remover duplicados de pacientes pelo ID
        const pacientesUnicos = Array.from(
          new Map(resPacientes.data.map((p) => [p.id, p])).values(),
        );

        setPacientes(pacientesUnicos);
        setMedicos(resMedicos.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        setCarregando(false);
      });
  }, []);

  const filtrados = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cpf?.toLowerCase().includes(busca.toLowerCase()) ||
      p.email?.toLowerCase().includes(busca.toLowerCase()) ||
      p.telefone?.toLowerCase().includes(busca.toLowerCase()),
  );

  async function deletarPaciente(id) {
    try {
      await axios.delete(`http://localhost:8080/api/pacientes/${id}`);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (err.response?.status === 404) {
        alert(
          "Não é possível excluir este paciente porque existem medicos ou atendimentos associados.",
        );
      } else {
        alert("Erro inesperado ao excluir médico.");
      }
    }
  }

  async function criarPaciente(e) {
    e.preventDefault();

    console.log("Enviando JSON:", novoPaciente);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/pacientes",
        novoPaciente,
      );

      // adiciona no estado
      setPacientes((prev) => [...prev, res.data]);

      // limpa form
      setNovoPaciente({ nome: "", cpf: "", email: "", telefone: "" });

      setMostrarModal(false);
    } catch (err) {
      console.error("Erro ao criar paciente:", err);
    }
  } //Função de criar paciente -- Dps adicionar as outras páginas!

  function paginar(lista, paginaAtual, itensPorPagina) {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    return {
      dados: lista.slice(inicio, fim),
      totalPaginas: Math.ceil(lista.length / itensPorPagina),
    };
  }

  const { dados: pacientesPaginados, totalPaginas } = paginar(
    filtrados,
    paginaAtual,
    itensPorPagina,
  );
  return (
    <div className="pacientes-container">
      <h1>Pacientes</h1>
      <p>Lista de pacientes cadastrados no sistema.</p>

      <input
        type="text"
        placeholder="Buscar por nome, CPF, email ou telefone..."
        className="pacientes-busca"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPaginaAtual(1);
        }}
      />

      <button className="button-add" onClick={() => setMostrarModal(true)}>
        + Adicionar Paciente
      </button>

      {carregando ? (
        <p>Carregando pacientes...</p>
      ) : (
        <div className="pacientes-lista">
          {filtrados.length === 0 ? (
            <p>Nenhum paciente encontrado.</p>
          ) : (
            pacientesPaginados.map((p) => (
              <div key={p.id} className="paciente-card">
                <h2>{p.nome}</h2>

                <p>
                  <strong>ID:</strong> {p.id || "Não informado"}
                </p>
                <p>
                  <strong>CPF:</strong> {p.cpf || "Não informado"}
                </p>
                <p>
                  <strong>Email:</strong> {p.email || "Não informado"}
                </p>
                <p>
                  <strong>Telefone:</strong> {p.telefone || "Não informado"}
                </p>
                <button
                  className="button-delete-paciente"
                  onClick={() => deletarPaciente(p.id)}
                >
                  Deletar
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Novo Paciente</h2>

            <form onSubmit={criarPaciente} className="form-paciente">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nome"
                  className="input-nome"
                  value={novoPaciente.nome}
                  onChange={(e) =>
                    setNovoPaciente({ ...novoPaciente, nome: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="CPF"
                  className="input-cpf"
                  value={novoPaciente.cpf}
                  onChange={(e) =>
                    setNovoPaciente({ ...novoPaciente, cpf: e.target.value })
                  }
                />

                <input
                  type="email"
                  placeholder="E-mail"
                  className="input-email"
                  value={novoPaciente.email}
                  onChange={(e) =>
                    setNovoPaciente({ ...novoPaciente, email: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Telefone"
                  className="input-telefone"
                  value={novoPaciente.telefone}
                  onChange={(e) =>
                    setNovoPaciente({
                      ...novoPaciente,
                      telefone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Endereço"
                  className="input-endereco"
                  value={novoPaciente.endereco}
                  onChange={(e) =>
                    setNovoPaciente({
                      ...novoPaciente,
                      endereco: e.target.value,
                    })
                  }
                />

                <input
                  type="date"
                  className="input-data"
                  value={novoPaciente.dataNascimento}
                  onChange={(e) =>
                    setNovoPaciente({
                      ...novoPaciente,
                      dataNascimento: e.target.value,
                    })
                  }
                />

                <select
                  className="input-sexo"
                  value={novoPaciente.sexo}
                  onChange={(e) =>
                    setNovoPaciente({ ...novoPaciente, sexo: e.target.value })
                  }
                >
                  <option value="">Selecionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>

                <select
                  className="input-medico"
                  value={novoPaciente.medico.id || ""}
                  onChange={(e) =>
                    setNovoPaciente({
                      ...novoPaciente,
                      medico: { id: Number(e.target.value) },
                    })
                  }
                >
                  <option value="">Selecione um médico</option>
                  {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
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

        <span style={{ margin: "0 10px" }}>
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
export default Pacientes;
