import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import AgendaAtendente from "./pages/agenda/AgendaAtendente";
import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import Medicos from "./pages/medicos/Medicos";
import Pacientes from "./pages/pacientes/Pacientes";
import AgendaMedico from "./pages/agenda/AgendaMedico";
import Funcionarios from "./pages/funcionarios/Funcionarios";
import Prontuario from "./pages/prontuario/Prontuario";
import { useState } from "react";
import "./App.css";

function Layout({ logado, setLogado, role, setRole }) {
  const location = useLocation();

  function RotaPrivada({ children, rolePermitido }) {
    const token = localStorage.getItem("token");
    const roleUsuario = localStorage.getItem("role");

    if (!token) {
      return <Login setLogado={setLogado} setRole={setRole} />;
    }

    if (rolePermitido && roleUsuario !== rolePermitido) {
      return <h1>Acesso negado</h1>;
    }

    return children;
  }
  
  const page =
    location.pathname === "/"
      ? "home"
      : location.pathname.replace("/", "").toLowerCase();

  return (
    <div className={`page-container ${page}`}>
      {logado && (
        <nav>
          <Link to="/" className="navItem">
            Home
          </Link>

          {role === "MEDICO" && (
            <Link to="/Agenda" className="navItem">
              Agenda
            </Link>
          )}

          {role === "ATENDENTE" && (
            <>
              <Link to="/Medicos" className="navItem">
                Medicos
              </Link>
              <Link to="/Pacientes" className="navItem">
                Pacientes
              </Link>
              <Link to="/Funcionarios" className="navItem">
                Funcionarios
              </Link>
              <Link to="/AgendaMedicos" className="navItem">
                Agenda Médicos
              </Link>
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
            logado ? (
              <Navigate to={role === "MEDICO" ? "/Agenda" : "/"} />
            ) : (
              <Login setLogado={setLogado} setRole={setRole} />
            )
          }
        />

        <Route
          path="/"
          element={
            <RotaPrivada logado={logado} setLogado={setLogado}>
              <Home />
            </RotaPrivada>
          }
        />

        <Route
          path="/Agenda"
          element={
            <RotaPrivada rolePermitido="MEDICO">
              <AgendaMedico />
            </RotaPrivada>
          }
        />

        <Route
          path="/AgendaMedicos"
          element={
            <RotaPrivada rolePermitido="ATENDENTE">
              <AgendaAtendente />
            </RotaPrivada>
          }
        />

        <Route
          path="/Medicos"
          element={
            <RotaPrivada rolePermitido="ATENDENTE">
              <Medicos />
            </RotaPrivada>
          }
        />

        <Route
          path="/Pacientes"
          element={
            <RotaPrivada rolePermitido="ATENDENTE">
              <Pacientes />
            </RotaPrivada>
          }
        />

        {/* Tela de cadastro de Funcionários: Desenhada para o ATENDENTE gerenciar */}
        <Route
          path="/Funcionarios"
          element={
            <RotaPrivada rolePermitido="ATENDENTE">
              <Funcionarios />
            </RotaPrivada>
          }
        />
        
        {/* Prontuário: Exclusivo para o MEDICO evoluir o paciente */}
        <Route
          path="/prontuario/:consultaId"
          element={
            <RotaPrivada rolePermitido="MEDICO">
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
      <Layout
        logado={logado}
        setLogado={setLogado}
        role={role}
        setRole={setRole}
      />
    </Router>
  );
}