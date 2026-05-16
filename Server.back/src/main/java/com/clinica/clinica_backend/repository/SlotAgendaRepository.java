package com.clinica.clinica_backend.repository;

import com.clinica.clinica_backend.model.SlotAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface SlotAgendaRepository extends JpaRepository<SlotAgenda, Integer> {

    // Todos os slots
    List<SlotAgenda> findByMedicoId(Integer medicoId);

    // Slots livres do médico

    List<SlotAgenda> findByMedicoIdAndStatus(Integer medicoId, String status);

    // logica para trabalhar com calendário,intervalo de datas
    List<SlotAgenda> findByMedicoIdAndDataHoraInicioGreaterThanEqualAndDataHoraInicioLessThan(
            Integer medicoId,
            LocalDateTime inicio,
            LocalDateTime fim);
}