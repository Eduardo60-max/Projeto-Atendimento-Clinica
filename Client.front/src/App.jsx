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
import Login from "./pages/Login/login";
import Medicos from "./pages/medicos/Medicos";
import Pacientes from "./pages/pacientes/Pacientes";
import AgendaMedico from "./pages/agenda/AgendaMedico";
import Funcionarios from "./pages/funcionarios/Funcionarios";
import Prontuario from "./pages/prontuario/Prontuario";
import Leitos from "./pages/leitos/Leitos";
import Consultas from "./pages/consultas/consultas";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "./App.css";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

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
              <>
                        <Link to="/Agenda" className="navItem">
                          Agenda
                        </Link>
                        <Link to="/Consultas" className="navItem">
                          Consultas
                        </Link>
                      </>
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

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/Login"
            element={
              logado ? (
                <Navigate to={role === "MEDICO" ? "/Agenda" : "/"} />
              ) : (
                <PageTransition>
                  <Login setLogado={setLogado} setRole={setRole} />
                </PageTransition>
              )
            }
          />

          <Route
            path="/"
            element={
              <RotaPrivada>
                <PageTransition>
                  <Home />
                </PageTransition>
              </RotaPrivada>
            }
          />

          <Route
            path="/Agenda"
            element={
              <RotaPrivada rolePermitido="MEDICO">
                <PageTransition>
                  <AgendaMedico />
                </PageTransition>
              </RotaPrivada>
            }
          />
          
           <Route
             path="/Leitos"
             element={
             <RotaPrivada>
             <Leitos />
             </RotaPrivada>
          }
           />
          <Route
            path="/AgendaMedicos"
            element={
              <RotaPrivada rolePermitido="ATENDENTE">
                <PageTransition>
                  <AgendaAtendente />
                </PageTransition>
              </RotaPrivada>
            }
          />

          <Route
            path="/Medicos"
            element={
              <RotaPrivada rolePermitido="ATENDENTE">
                <PageTransition>
                  <Medicos />
                </PageTransition>
              </RotaPrivada>
            }
          />

          <Route
            path="/Pacientes"
            element={
              <RotaPrivada rolePermitido="ATENDENTE">
                <PageTransition>
                  <Pacientes />
                </PageTransition>
              </RotaPrivada>
            }
          />

          <Route
            path="/Consultas"
            element={
              <RotaPrivada rolePermitido="MEDICO">
                <PageTransition>
                  <Consultas />
                </PageTransition>
              </RotaPrivada>
            }
          />

          <Route
            path="/Funcionarios"
            element={
              <RotaPrivada rolePermitido="ATENDENTE">
                <PageTransition>
                  <Funcionarios />
                </PageTransition>
              </RotaPrivada>
            }
          />

          <Route
            path="/prontuario/:consultaId"
            element={
              <RotaPrivada rolePermitido="MEDICO">
                <PageTransition>
                  <Prontuario />
                </PageTransition>
              </RotaPrivada>
            }
          />
        </Routes>
      </AnimatePresence>
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
