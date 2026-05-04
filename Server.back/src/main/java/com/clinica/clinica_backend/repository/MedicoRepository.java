package com.clinica.clinica_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.clinica_backend.model.Medico;

public interface MedicoRepository extends JpaRepository<Medico, Integer> {
    Optional<Medico> findByCrm(String crm);
}
