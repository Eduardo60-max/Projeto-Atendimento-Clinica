package com.clinica.clinica_backend.repository;

import com.clinica.clinica_backend.model.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AgendaRepository extends JpaRepository<Agenda, Integer> {

    Optional<Agenda> findByAtendimentoId(Integer atendimentoId);

    List<Agenda> findByFuncionarioId(Integer funcionarioId);

    List<Agenda> findByStatus(String status);

    @Query("SELECT a FROM Agenda a WHERE CAST(a.dataAgenda AS date) = :data")
    List<Agenda> findByDataAgenda(LocalDate data);

    @Query("SELECT ag FROM Agenda ag WHERE ag.atendimento.medico.id = :medicoId")
    List<Agenda> findByMedicoId(Integer medicoId);
}