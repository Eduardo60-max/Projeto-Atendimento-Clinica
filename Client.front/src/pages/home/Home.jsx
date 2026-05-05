import { useEffect, useState } from "react";
import api from "../../api/api";
import "./home.css";

function Home() {
  const [quantPacientes, setQuantPacientes] = useState(0);
  const [quantMedicos, setQuantMedicos] = useState(0);
  const [quantAtendimentos, setQuantAtendimentos] = useState(0);

  useEffect(() => {
    api
      .get("/pacientes")
      .then((res) => setQuantPacientes(res.data.length))
      .catch((err) => console.error(err));

    api
      .get("/medicos")
      .then((res) => setQuantMedicos(res.data.length))
      .catch((err) => console.error(err));

    api
      .get("/atendimentos")
      .then((res) => setQuantAtendimentos(res.data.length))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <h1>Painel da Clínica</h1>

      <div className="cards">
        <div className="card">
          <h2>Pacientes</h2>
          <p>{quantPacientes}</p>
        </div>

        <div className="card">
          <h2>Médicos</h2>
          <p>{quantMedicos}</p>
        </div>

        <div className="card">
          <h2>Atendimentos</h2>
          <p>{quantAtendimentos}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
