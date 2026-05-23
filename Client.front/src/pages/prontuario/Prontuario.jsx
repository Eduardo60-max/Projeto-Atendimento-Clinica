import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./prontuario.css";

const Prontuario = () => {
  const { consultaId } = useParams(); 
  const navigate = useNavigate();

  const [consulta, setConsulta] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const carregarProntuario = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/prontuarios/consulta/${consultaId}`);
        
        if (response.data) {
          setDescricao(response.data.descricao || "");
          setConsulta(response.data.consulta); 
        }
      } catch (error) {
        console.error("Erro ao carregar o prontuário:", error);
        setMensagem({
          tipo: "erro",
          texto: "Não foi possível carregar os dados desta consulta.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (consultaId) {
      carregarProntuario();
    }
  }, [consultaId]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      setSalvando(true);
      setMensagem({ tipo: "", texto: "" });

      await api.post("/prontuarios", {
        consultaId: parseInt(consultaId),
        descricao: descricao,
      });

      setMensagem({ tipo: "sucesso", texto: "Prontuário salvo com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar prontuário:", error);
      setMensagem({
        tipo: "erro",
        texto: "Erro ao salvar o prontuário. Tente novamente.",
      });
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Carregando dados da consulta...</div>;
  }

  return (
    <div className="prontuario-container">
      <h2 className="prontuario-title">Prontuário Eletrônico</h2>
      <hr className="prontuario-divider" />

      {consulta ? (
        <div className="consulta-card">
          <h3>Informações da Consulta</h3>
          <p><strong>Paciente:</strong> {consulta.paciente?.nome || "Não informado"}</p>
          <p><strong>Médico:</strong> {consulta.medico?.nome || "Não informado"}</p>
          <p><strong>Data:</strong> {consulta.data ? new Date(consulta.data).toLocaleDateString('pt-BR') : "Não informada"}</p>
        </div>
      ) : (
        <div className="consulta-aviso">
          <p>Aviso: Dados informativos da consulta não foram encontrados, mas você ainda pode salvar o prontuário.</p>
        </div>
      )}

      {mensagem.texto && (
        <div className={`mensagem-feedback ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSalvar}>
        <div className="form-group">
          <label htmlFor="descricao" className="form-label">
            Evolução Médica / Descrição da Consulta:
          </label>
          <textarea
            id="descricao"
            className="textarea-prontuario"
            rows="12"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite aqui o histórico do paciente, sintomas, diagnósticos e receitas desta consulta..."
            required
          />
        </div>

        <div className="btn-group">
          <button
            type="submit"
            className="btn btn-salvar"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar Prontuário"}
          </button>
          
          <button
            type="button"
            className="btn btn-voltar"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Prontuario;