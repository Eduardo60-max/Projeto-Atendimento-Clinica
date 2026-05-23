import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import Medicos from "./pages/medicos/Medicos";
import Pacientes from "./pages/pacientes/Pacientes";
import Atendimentos from "./pages/atendimento/Atendimentos";
import Funcionarios from "./pages/funcionarios/Funcionarios";
import Prontuario from "./pages/prontuario/Prontuario"; // 1. IMPORTAÇÃO DA NOVA TELA
import { useState } from "react";
import "./App.css";

function Layout({ logado, setLogado, role, setRole }) {
  const location = useLocation();

  function RotaPrivada({ children, rolesPermitidos }) {
    const token = localStorage.getItem("token");
    const roleUsuario = localStorage.getItem("role");

    if (!token) {
      return <Login setLogado={setLogado} setRole={setRole} />;
    }

    // Se houver restrição de roles e a role do usuário não estiver na lista permitida
    if (rolesPermitidos && !rolesPermitidos.includes(roleUsuario)) {
      return <h1>Acesso negado</h1>;
    }

    return children;
  }

  const page =
    location.pathname === "/"
      ? "home"
      : location.pathname.replace("/", "").replace(/\/\d+/g, "").toLowerCase();

  return (
    <div className={`page-container ${page}`}>
      {logado && (
        <nav>
          <Link to="/" className="navItem">Home</Link>

          <Link to="/Atendimentos" className="navItem">
            Atendimentos
          </Link>

          {role === "ATENDENTE" && (
            <>
              <Link to="/Medicos" className="navItem">Medicos</Link>
              <Link to="/Pacientes" className="navItem">Pacientes</Link>
              <Link to="/Funcionarios" className="navItem">Funcionarios</Link>
            </>
          )}

          <button
            onClick={() => {
              localStorage.clear();
              setLogado(false);
              setRole("");
            }}
          >
            Sair
          </button>
        </nav>
      )}

      <Routes>
        <Route
          path="/Login"
          element={
            /* CORRIGIDO: Se for MEDICO ou FUNCIONARIO, vai direto para Atendimentos */
            logado ? (
              <Navigate to={role === "MEDICO" || role === "FUNCIONARIO" ? "/Atendimentos" : "/"} />
            ) : (
              <Login setLogado={setLogado} setRole={setRole} />
            )
          }
        />

        <Route
          path="/"
          element={
            <RotaPrivada>
              <Home />
            </RotaPrivada>
          }
        />

        <Route
          path="/Medicos"
          element={
            <RotaPrivada rolesPermitidos={["ATENDENTE"]}>
              <Medicos />
            </RotaPrivada>
          }
        />

        <Route
          path="/Pacientes"
          element={
            <RotaPrivada rolesPermitidos={["ATENDENTE"]}>
              <Pacientes />
            </RotaPrivada>
          }
        />

        <Route
          path="/Atendimentos"
          element={
            <RotaPrivada>
              <Atendimentos />
            </RotaPrivada>
          }
        />

        <Route
          path="/Funcionarios"
          element={
            <RotaPrivada rolesPermitidos={["ATENDENTE"]}>
              <Funcionarios />
            </RotaPrivada>
          }
        />
        
        {/* ROTA DO PRONTUÁRIO ATUALIZADA: Liberada bem limpa para os dois usando Array */}
        <Route
          path="/prontuario/:consultaId"
          element={
            <RotaPrivada rolesPermitidos={["MEDICO", "FUNCIONARIO"]}>
              <Prontuario />
            </RotaPrivada>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  const [logado, setLogado] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  return (
    <Router>
      <Layout logado={logado} setLogado={setLogado} role={role} setRole={setRole} />
    </Router>
  );
}