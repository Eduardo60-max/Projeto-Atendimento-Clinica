package com.clinica.clinica_backend.repository;

import com.clinica.clinica_backend.model.Enfermeiro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EnfermeiroRepository extends JpaRepository<Enfermeiro, Integer> {
    Optional<Enfermeiro> findByCoren(String coren);

    boolean existsByCoren(String coren);
}