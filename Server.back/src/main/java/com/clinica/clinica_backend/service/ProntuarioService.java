package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.dto.ProntuarioDto;
import com.clinica.clinica_backend.model.*;
import com.clinica.clinica_backend.repository.ConsultaRepository;
import com.clinica.clinica_backend.repository.ProntuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepo;
    private final ConsultaRepository consultaRepo;

    public ProntuarioService(ProntuarioRepository prontuarioRepo,
            ConsultaRepository consultaRepo) {
        this.prontuarioRepo = prontuarioRepo;
        this.consultaRepo = consultaRepo;
    }

    // Médico cria ou edita o prontuário de uma consulta
    public Prontuario salvarOuAtualizar(ProntuarioDto dto) {
        Consulta consulta = consultaRepo.findById(dto.getConsultaId())
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        // Se já existe prontuário para essa consulta, atualiza
        // Se não existe, cria um novo
        Prontuario prontuario = prontuarioRepo
                .findByConsultaId(dto.getConsultaId())
                .orElse(new Prontuario());

        prontuario.setConsulta(consulta);
        prontuario.setMedico(consulta.getSlot().getMedico());
        prontuario.setPaciente(consulta.getPaciente());
        prontuario.setDescricao(dto.getDescricao());

        return prontuarioRepo.save(prontuario);
    }

    public Prontuario buscarPorConsulta(Integer consultaId) {
        return prontuarioRepo.findByConsultaId(consultaId)
                .orElseThrow(() -> new RuntimeException("Prontuário não encontrado"));
    }

    // Histórico completo de prontuários
    public List<Prontuario> buscarPorPaciente(Integer pacienteId) {
        return prontuarioRepo.findByPacienteId(pacienteId);
    }

    // Todos os prontuários escritos por um médico
    public List<Prontuario> buscarPorMedico(Integer medicoId) {
        return prontuarioRepo.findByMedicoId(medicoId);
    }
}