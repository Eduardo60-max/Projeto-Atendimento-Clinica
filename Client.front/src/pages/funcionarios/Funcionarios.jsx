import "./funcionarios.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Funcionarios() {
  const [busca, setBusca] = useState("");
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  const [mostrarModal, setMostrarModal] = useState(false);

  // novo funcionário
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    telefone: "",
  });

  useEffect(() => {
    setCarregando(true);

    axios
      .get("http://localhost:8080/api/funcionarios")
      .then((res) => {
        // remove duplicados se o backend estiver repetindo
        const unicos = Array.from(
          new Map(res.data.map((f) => [f.id, f])).values(),
        );
        setFuncionarios(unicos);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar funcionários:", err);
        setCarregando(false);
      });
  }, []);

  // filtro
  const filtrados = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cargo.toLowerCase().includes(busca.toLowerCase()) ||
      String(f.cpf).includes(busca),
  );

  const { dados: funcionariosPaginados, totalPaginas } = paginar(
    filtrados,
    paginaAtual,
    itensPorPagina,
  );

  // deletar
  async function deletarFuncionario(id) {
    try {
      await axios.delete(`http://localhost:8080/api/funcionarios/${id}`);
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Erro ao deletar funcionário:", err);
    }
  }

  // criar
  async function criarFuncionario(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/funcionarios",
        novoFuncionario,
      );

      setFuncionarios((prev) => [...prev, res.data]);

      setNovoFuncionario({ nome: "", cpf: "", cargo: "", telefone: "" });
      setMostrarModal(false);
    } catch (err) {
      console.error("Erro ao criar funcionário:", err);
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
    <div className="funcionarios-container">
      <h1>Funcionários</h1>
      <p>Lista de funcionários cadastrados no sistema.</p>

      <input
        type="text"
        placeholder="Buscar por nome, CPF ou cargo..."
        className="funcionarios-busca"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <button className="button-add" onClick={() => setMostrarModal(true)}>
        + Adicionar Funcionário
      </button>

      {carregando ? (
        <p>Carregando funcionários...</p>
      ) : (
        <div className="funcionarios-lista">
          {filtrados.length === 0 ? (
            <p>Nenhum funcionário encontrado.</p>
          ) : (
            funcionariosPaginados.map((f) => (
              <div key={f.id} className="funcionario-card">
                <h2>{f.nome}</h2>
                <p>
                  <strong>CPF:</strong> {f.cpf}
                </p>
                <p>
                  <strong>Cargo:</strong> {f.cargo}
                </p>
                <p>
                  <strong>Telefone:</strong> {f.telefone}
                </p>

                <button
                  className="button-delete-funcionario"
                  onClick={() => deletarFuncionario(f.id)}
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
            <h2>Novo Funcionário</h2>

            <form onSubmit={criarFuncionario} className="form-funcionario">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nome"
                  value={novoFuncionario.nome}
                  onChange={(e) => {
                    setNovoFuncionario({
                      ...novoFuncionario,
                      nome: e.target.value,
                    });
                    setPaginaAtual(1);
                  }}
                  required
                />

                <input
                  type="text"
                  placeholder="CPF"
                  value={novoFuncionario.cpf}
                  onChange={(e) =>
                    setNovoFuncionario({
                      ...novoFuncionario,
                      cpf: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Cargo"
                  value={novoFuncionario.cargo}
                  onChange={(e) =>
                    setNovoFuncionario({
                      ...novoFuncionario,
                      cargo: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Telefone"
                  value={novoFuncionario.telefone}
                  onChange={(e) =>
                    setNovoFuncionario({
                      ...novoFuncionario,
                      telefone: e.target.value,
                    })
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

export default Funcionarios;
