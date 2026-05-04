import { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";

function Home() {
  const [quantPacientes, setQuantPacientes] = useState(0);
  const [quantMedicos, setQuantMedicos] = useState(0);
  const [quantAtendimentos, setQuantAtendimentos] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/pacientes")
      .then((res) => setQuantPacientes(res.data.length))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:8080/api/medicos")
      .then((res) => setQuantMedicos(res.data.length))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:8080/api/atendimentos")
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
