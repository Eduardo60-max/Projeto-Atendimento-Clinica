package com.clinica.clinica_backend.repository;

import com.clinica.clinica_backend.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    Optional<Funcionario> findByCpf(String cpf);

    List<Funcionario> findByCargo(String cargo);

    boolean existsByCpf(String cpf);
}