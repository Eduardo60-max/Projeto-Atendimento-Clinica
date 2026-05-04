package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.model.Atendimento;
import com.clinica.clinica_backend.repository.AtendimentoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AtendimentoService {
    private final AtendimentoRepository repo;

    public AtendimentoService(AtendimentoRepository repo) {
        this.repo = repo;
    }

    public List<Atendimento> listarTodos() {
        return repo.findAll();
    }

    public Atendimento buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Atendimento não encontrado"));
    }

    public List<Atendimento> buscarPorMedico(Integer medicoId) {
        return repo.findByMedicoId(medicoId);
    }

    public List<Atendimento> buscarPorPaciente(Integer pacienteId) {
        return repo.findByPacienteId(pacienteId);
    }

    public List<Atendimento> buscarPorStatus(String status) {
        return repo.findByStatus(status);
    }

    public boolean verificarDisponibilidade(Integer medicoId, LocalDateTime dataHora) {
        Integer count = repo.countByMedicoAndDataHora(medicoId, dataHora);
        return count == 0;
    }

    public Atendimento cancelarAtendimento(Integer id) {
        Atendimento atendimento = buscarPorId(id);
        atendimento.setStatus("CANCELADO");
        return repo.save(atendimento);
    }

    public void deletar(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Atendimento não encontrado");
        }
        repo.deleteById(id);
    }
}