package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.model.Agenda;
import com.clinica.clinica_backend.repository.AgendaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class AgendaService {
    private final AgendaRepository repo;

    public AgendaService(AgendaRepository repo) {
        this.repo = repo;
    }

    public List<Agenda> listarTodos() {
        return repo.findAll();
    }

    public Agenda buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agenda não encontrada"));
    }

    public Agenda buscarPorAtendimento(Integer atendimentoId) {
        return repo.findByAtendimentoId(atendimentoId)
                .orElseThrow(() -> new RuntimeException("Agenda não encontrada para este atendimento"));
    }

    public List<Agenda> buscarPorFuncionario(Integer funcionarioId) {
        return repo.findByFuncionarioId(funcionarioId);
    }

    public List<Agenda> buscarPorStatus(String status) {
        return repo.findByStatus(status);
    }

    public List<Agenda> buscarAgendamentosDoDia(LocalDate data) {
        return repo.findByDataAgenda(data);
    }

    public List<Agenda> buscarPorMedico(Integer medicoId) {
        return repo.findByMedicoId(medicoId);
    }

    public void deletar(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Agenda não encontrada");
        }
        repo.deleteById(id);
    }
}