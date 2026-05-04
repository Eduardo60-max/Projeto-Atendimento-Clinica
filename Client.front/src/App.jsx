import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Medicos from "./pages/medicos/Medicos";
import Pacientes from "./pages/pacientes/Pacientes";
import Atendimentos from "./pages/atendimento/Atendimentos";
import Funcionarios from "./pages/funcionarios/Funcionarios";
import { useState } from "react";
import "./App.css";

function Layout({ logado, setLogado }) {
  const location = useLocation();

  function RotaPrivada({ logado, children, setLogado }) {
    return logado ? children : <Login setLogado={setLogado} />;
  }

  // transforma a rota em nome de classe
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
          <Link to="/Medicos" className="navItem">
            Medicos
          </Link>
          <Link to="/Pacientes" className="navItem">
            Pacientes
          </Link>
          <Link to="/Atendimentos" className="navItem">
            Atendimentos
          </Link>
          <Link to="/Funcionarios" className="navItem">
            Funcionarios
          </Link>

          <button onClick={() => setLogado(false)}>Sair</button>
        </nav>
      )}

      <Routes>
        <Route path="/Login" element={<Login setLogado={setLogado} />} />

        <Route
          path="/"
          element={
            <RotaPrivada logado={logado} setLogado={setLogado}>
              <Home />
            </RotaPrivada>
          }
        />

        <Route
          path="/Medicos"
          element={
            <RotaPrivada logado={logado} setLogado={setLogado}>
              <Medicos />
            </RotaPrivada>
          }
        />

        <Route
          path="/Pacientes"
          element={
            <RotaPrivada logado={logado} setLogado={setLogado}>
              <Pacientes />
            </RotaPrivada>
          }
        />

        <Route
          path="/Atendimentos"
          element={
            <RotaPrivada logado={logado} setLogado={setLogado}>
              <Atendimentos />
            </RotaPrivada>
          }
        />

        <Route
          path="/Funcionarios"
          element={
            <RotaPrivada logado={logado} setLogado={setLogado}>
              <Funcionarios />
            </RotaPrivada>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  const [logado, setLogado] = useState(false);

  return (
    <Router>
      <Layout logado={logado} setLogado={setLogado} />
    </Router>
  );
}
