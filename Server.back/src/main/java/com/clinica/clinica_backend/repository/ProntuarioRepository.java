package com.clinica.clinica_backend.repository;

import com.clinica.clinica_backend.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Integer> {

    Optional<Prontuario> findByConsultaId(Integer consultaId);

    List<Prontuario> findByPacienteId(Integer pacienteId);

    List<Prontuario> findByMedicoId(Integer medicoId);
}