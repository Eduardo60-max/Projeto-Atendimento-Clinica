package com.clinica.clinica_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.clinica_backend.model.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    Optional<Paciente> findByCpf(String cpf);

    List<Paciente> findByMedicoId(Integer medicoId);
}
