import "./leitos.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function Leitos() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

  useEffect(() => {
    carregarPacientes();
  }, []);
  //----------------------------------------------------------------------------------
  // falta
  // adição de listra azul e logo da clinica
  //modificar design do card de leito
  //mudar controler paciente para retornar enfermeiro
//----------------------------------------------------------------------------------
  async function carregarPacientes() {
    try {
      setCarregando(true);
      setErro(null);

      const res = await api.get("/pacientes");

      setPacientes(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pacientes:", err);
      setErro("Não foi possível carregar cada paciente.");
    } finally {
      setCarregando(false);
    }
  }

  // teste
  function nomeMedico(p) {
    return p.medico?.nome || p.medicoNome || "Não atribuido";
  }

  // teste
  function nomeEnfermeiro(p) {
    return p.enfermeiro?.nome || p.enfermeiroNome || "Nao atribuido";
  }

  const filtrados = pacientes.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      (p.nome || "").toLowerCase().includes(termo) ||
      nomeMedico(p).toLowerCase().includes(termo) ||
      nomeEnfermeiro(p).toLowerCase().includes(termo)
    );
  });

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
    <div className="leitos">
      <div className="leitos-topo">
        <button className="btn-voltar" onClick={() => navigate("/")}>
          Voltar
        </button>
      </div>

      <h1>Leitos</h1>

      <p>Pacientes internados e suas equipes responsáveis.</p>

      <input
        type="text"
        placeholder="Buscar por paciente, medico ou enfermeiro"
        className="leitos-busca"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPaginaAtual(1);
        }}
      />

      {carregando ? (
        <p>Carregando leitos...</p>
      ) : erro ? (
        <p className="leitos-erro">{erro}</p>
      ) : (
        <div className="leitos-lista">
          {filtrados.length === 0 ? (
            <p>Nenhum leito encontrado.</p>
          ) : (
            pacientesPaginados.map((p) => (
              <div key={p.id} className="leito-cartao">
                <h2>{p.nome}</h2>

                <p>
                  <strong>Médico responsável:</strong> {nomeMedico(p)}
                </p>

                <p>
                  <strong>Enfermeiro responsável:</strong>{" "}
                  {nomeEnfermeiro(p)}
                </p>
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
          onClick={() =>
            setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
          }
          disabled={paginaAtual === totalPaginas || totalPaginas === 0}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Leitos;