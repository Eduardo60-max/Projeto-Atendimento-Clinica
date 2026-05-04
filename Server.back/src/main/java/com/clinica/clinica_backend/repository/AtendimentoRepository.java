package com.clinica.clinica_backend.repository;

import com.clinica.clinica_backend.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Integer> {

    List<Atendimento> findByMedicoId(Integer medicoId);

    List<Atendimento> findByPacienteId(Integer pacienteId);

    List<Atendimento> findByStatus(String status);

    @Query("SELECT COUNT(a) FROM Atendimento a WHERE a.medico.id = :medicoId AND a.dataHora = :dataHora AND a.status != 'CANCELADO'")
    Integer countByMedicoAndDataHora(Integer medicoId, LocalDateTime dataHora);
}