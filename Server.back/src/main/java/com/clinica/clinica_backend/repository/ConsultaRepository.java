package com.clinica.clinica_backend.repository;

import com.clinica.clinica_backend.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {

    List<Consulta> findByPacienteId(Integer pacienteId);

    List<Consulta> findByStatus(String status);

    List<Consulta> findBySlotMedicoId(Integer medicoId);
}