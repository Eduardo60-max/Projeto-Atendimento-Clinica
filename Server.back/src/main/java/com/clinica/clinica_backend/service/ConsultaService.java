package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.dto.ConsultaDto;
import com.clinica.clinica_backend.model.*;
import com.clinica.clinica_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ConsultaService {

    private final ConsultaRepository consultaRepo;
    private final SlotAgendaRepository slotRepo;
    private final PacienteRepository pacienteRepo;
    private final FuncionarioRepository funcionarioRepo;
    private final ProntuarioRepository prontuarioRepo;

    public ConsultaService(ConsultaRepository consultaRepo,
            SlotAgendaRepository slotRepo,
            PacienteRepository pacienteRepo,
            FuncionarioRepository funcionarioRepo,
            ProntuarioRepository prontuarioRepo) {
        this.consultaRepo = consultaRepo;
        this.slotRepo = slotRepo;
        this.pacienteRepo = pacienteRepo;
        this.funcionarioRepo = funcionarioRepo;
        this.prontuarioRepo = prontuarioRepo;
    }

    @Transactional
    public Consulta agendar(ConsultaDto dto) {
        SlotAgenda slot = slotRepo.findById(dto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot não encontrado"));

        // Garante que o slot ainda está livre
        if (!"LIVRE".equals(slot.getStatus())) {
            throw new RuntimeException("Este horário não está disponível");
        }

        Paciente paciente = pacienteRepo.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Funcionario funcionario = funcionarioRepo.findById(dto.getFuncionarioId())
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Consulta consulta = new Consulta();
        consulta.setSlot(slot);
        consulta.setPaciente(paciente);
        consulta.setFuncionario(funcionario);
        consulta.setTipo(dto.getTipo());
        consulta.setPreco(dto.getPreco());
        consulta.setStatus("AGENDADO");

        Consulta salva = consultaRepo.save(consulta);

        slot.setStatus("OCUPADO");
        slotRepo.save(slot);

        return salva;
    }

    @Transactional
    public Consulta realizar(Integer consultaId) {
        Consulta consulta = buscarPorId(consultaId);

        if (!"AGENDADO".equals(consulta.getStatus())) {
            throw new RuntimeException("Só é possível realizar consultas com status AGENDADO");
        }

        consulta.setStatus("REALIZADO");
        consultaRepo.save(consulta);

        // Cria o prontuário vazio

        Prontuario prontuario = new Prontuario();
        prontuario.setConsulta(consulta);
        prontuario.setMedico(consulta.getSlot().getMedico());
        prontuario.setPaciente(consulta.getPaciente());
        prontuario.setDescricao(""); // vazio — médico preenche depois
        prontuarioRepo.save(prontuario);

        return consulta;
    }

    @Transactional
    public Consulta cancelar(Integer consultaId) {
        Consulta consulta = buscarPorId(consultaId);

        if ("REALIZADO".equals(consulta.getStatus())) {
            throw new RuntimeException("Não é possível cancelar uma consulta já realizada");
        }

        consulta.setStatus("CANCELADO");
        consultaRepo.save(consulta);

        SlotAgenda slot = consulta.getSlot();
        slot.setStatus("LIVRE");
        slotRepo.save(slot);

        return consulta;
    }

    public Consulta buscarPorId(Integer id) {
        return consultaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
    }

    public List<Consulta> buscarPorMedico(Integer medicoId) {
        return consultaRepo.findBySlotMedicoId(medicoId);
    }

    public List<Consulta> buscarPorPaciente(Integer pacienteId) {
        return consultaRepo.findByPacienteId(pacienteId);
    }

    public List<Consulta> buscarPorStatus(String status) {
        return consultaRepo.findByStatus(status);
    }
}