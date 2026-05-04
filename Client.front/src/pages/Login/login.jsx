import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login({ setLogado }) {
  const [tipo, setTipo] = useState("MEDICO");
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const labelIdentificador = tipo === "MEDICO" ? "CRM" : "CPF";
  const placeholderIdentificador =
    tipo === "MEDICO" ? "Digite seu CRM" : "Digite seu CPF";

  const handleTipo = (novoTipo) => {
    setTipo(novoTipo);
    setIdentificador("");
    setSenha("");
    setErro("");
    setHasError(false);
  };

  // const handleSubmit = async () => {
  //   setErro("");
  //   setHasError(false);

  //   if (!identificador.trim() || !senha.trim()) {
  //     setErro("Preencha todos os campos.");
  //     setHasError(true);
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch("http://localhost:8080/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         identificador: identificador.trim(),
  //         senha,
  //         tipo,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const msg = await response.text();
  //       setErro(msg || "Credenciais inválidas.");
  //       setHasError(true);
  //       return;
  //     }

  //     const data = await response.json();
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("role", data.role);
  //     localStorage.setItem("nome", data.nome);

  //     setLogado(true);
  //     navigate("/");

  //     alert(`Bem-vindo(a), ${data.nome}! Role: ${data.role}`);
  //   } catch {
  //     setErro("Erro ao conectar com o servidor.");
  //     setHasError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async () => {
  //   // 👇 ESSENCIAL
  //   setLogado(true);

  //   // 👇 REDIRECIONAMENTO
  //   navigate("/");
  // };

  async function login(identificador, senha, tipo) {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          identificador,
          senha,
          tipo,
        },
      );

      const { token, role, nome } = response.data;

      // salva dados
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("nome", nome);

      // configura axios global
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // libera acesso no app
      setLogado(true);

      // redireciona
      navigate("/");
    } catch (err) {
      console.error(err);
      setErro("Credenciais inválidas ou erro no servidor.");
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  // const handleSubmit = () => {
  //   setErro("");
  //   setHasError(false);

  //   if (!identificador.trim() || !senha.trim()) {
  //     setErro("Preencha todos os campos.");
  //     setHasError(true);
  //     return;
  //   }

  //   login(identificador.trim(), senha, tipo);
  // };

  const handleSubmit = () => {
    setErro("");
    setHasError(false);

    if (!identificador.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      setHasError(true);
      return;
    }

    // 🔥 LOGIN MOCKADO (sem backend)
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("role", tipo);
    localStorage.setItem("nome", identificador);

    setLogado(true);

    // 🔥 REDIRECIONA
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="login-body">
      <div className="login-card">
        <div className="panel-left">
          <div className="logo">Clínica</div>
          <div className="panel-left-body">
            <h1 className="welcome-title">
              Bem-vindo ao
              <br />
              sistema!
            </h1>
            <p className="welcome-desc">
              Acesse com suas credenciais para gerenciar consultas, pacientes e
              muito mais.
            </p>
          </div>
          <div className="panel-footer">Sistema de Gestão — Clínica</div>
        </div>

        <div className="panel-right">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">
            Selecione seu perfil e entre com suas credenciais.
          </p>

          <div className="tipo-selector">
            <button
              className={`tipo-btn ${tipo === "MEDICO" ? "active" : ""}`}
              onClick={() => handleTipo("MEDICO")}
            >
              Medico
            </button>
            <button
              className={`tipo-btn ${tipo === "ATENDENTE" ? "active" : ""}`}
              onClick={() => handleTipo("ATENDENTE")}
            >
              Atendente
            </button>
          </div>

          <div className="field">
            <label htmlFor="identificador">{labelIdentificador}</label>
            <input
              id="identificador"
              type="text"
              placeholder={placeholderIdentificador}
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              onKeyDown={handleKeyDown}
              className={hasError ? "input-error" : ""}
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={handleKeyDown}
              className={hasError ? "input-error" : ""}
            />
          </div>

          {erro && <div className="error-msg">{erro}</div>}

          <button
            className="btn-login"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" /> Entrando...
              </>
            ) : (
              "ENTRAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
