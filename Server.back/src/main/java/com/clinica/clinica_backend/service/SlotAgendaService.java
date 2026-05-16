package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.dto.SlotAgendaDto;
import com.clinica.clinica_backend.model.Medico;
import com.clinica.clinica_backend.model.SlotAgenda;
import com.clinica.clinica_backend.repository.MedicoRepository;
import com.clinica.clinica_backend.repository.SlotAgendaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlotAgendaService {

    private final SlotAgendaRepository slotRepo;
    private final MedicoRepository medicoRepo;

    public SlotAgendaService(SlotAgendaRepository slotRepo, MedicoRepository medicoRepo) {
        this.slotRepo = slotRepo;
        this.medicoRepo = medicoRepo;
    }

    public SlotAgenda criar(SlotAgendaDto dto) {
        Medico medico = medicoRepo.findById(dto.getMedicoId())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        if (dto.getDataHoraFim().isBefore(dto.getDataHoraInicio())) {
            throw new RuntimeException("Horário de fim deve ser depois do início");
        }

        SlotAgenda slot = new SlotAgenda();
        slot.setMedico(medico);
        slot.setDataHoraInicio(dto.getDataHoraInicio());
        slot.setDataHoraFim(dto.getDataHoraFim());
        slot.setStatus("LIVRE");

        return slotRepo.save(slot);
    }

    // Todos os slots de um médico
    public List<SlotAgenda> buscarPorMedico(Integer medicoId) {
        return slotRepo.findByMedicoId(medicoId);
    }

    // Só os slots LIVRES de um médico
    public List<SlotAgenda> buscarLivresPorMedico(Integer medicoId) {
        return slotRepo.findByMedicoIdAndStatus(medicoId, "LIVRE");
    }

    // Slots de um médico num mês específico
    public List<SlotAgenda> buscarPorMedicoEMes(Integer medicoId,
            LocalDateTime inicio,
            LocalDateTime fim) {
        return slotRepo
                .findByMedicoIdAndDataHoraInicioGreaterThanEqualAndDataHoraInicioLessThan(
                        medicoId, inicio, fim);
    }

    // Médico cancela um horário que ainda está livre,middleware
    public SlotAgenda cancelar(Integer slotId) {
        SlotAgenda slot = buscarPorId(slotId);

        if ("OCUPADO".equals(slot.getStatus())) {
            throw new RuntimeException(
                    "Não é possível cancelar um slot já ocupado. Cancele a consulta primeiro.");
        }

        slot.setStatus("CANCELADO");
        return slotRepo.save(slot);
    }

    public SlotAgenda buscarPorId(Integer id) {
        return slotRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot não encontrado"));
    }

    public void deletar(Integer id) {
        SlotAgenda slot = buscarPorId(id);

        if ("OCUPADO".equals(slot.getStatus())) {
            throw new RuntimeException("Não é possível deletar um slot com consulta agendada.");
        }

        slotRepo.deleteById(id);
    }
}