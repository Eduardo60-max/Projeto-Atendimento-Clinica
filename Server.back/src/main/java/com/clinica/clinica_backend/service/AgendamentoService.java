package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.dto.AgendamentoDto;
import com.clinica.clinica_backend.dto.AgendamentoResponseDTO;
import com.clinica.clinica_backend.model.*;
import com.clinica.clinica_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AgendamentoService {

    private final AtendimentoRepository atendimentoRepo;
    private final AgendaRepository agendaRepo;
    private final MedicoRepository medicoRepo;
    private final PacienteRepository pacienteRepo;
    private final FuncionarioRepository funcionarioRepo;

    public AgendamentoService(
            AtendimentoRepository atendimentoRepo,
            AgendaRepository agendaRepo,
            MedicoRepository medicoRepo,
            PacienteRepository pacienteRepo,
            FuncionarioRepository funcionarioRepo) {
        this.atendimentoRepo = atendimentoRepo;
        this.agendaRepo = agendaRepo;
        this.medicoRepo = medicoRepo;
        this.pacienteRepo = pacienteRepo;
        this.funcionarioRepo = funcionarioRepo;
    }

    @Transactional
    public AgendamentoResponseDTO criarAgendamento(AgendamentoDto dto) {

        Medico medico = medicoRepo.findById(dto.getMedicoId())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        Paciente paciente = pacienteRepo.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Funcionario funcionario = funcionarioRepo.findById(dto.getFuncionarioId())
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Integer count = atendimentoRepo.countByMedicoAndDataHora(
                dto.getMedicoId(),
                dto.getDataHora());
        if (count > 0) {
            throw new RuntimeException("Médico não disponível neste horário");
        }

        Atendimento atendimento = new Atendimento();
        atendimento.setMedico(medico);
        atendimento.setPaciente(paciente);
        atendimento.setDescricao(dto.getDescricao());
        atendimento.setTipo(dto.getTipo());
        atendimento.setPreco(dto.getPreco());
        atendimento.setDataHora(dto.getDataHora());
        atendimento.setStatus("ATIVO");

        Atendimento atendimentoSalvo = atendimentoRepo.save(atendimento);

        Agenda agenda = new Agenda();
        agenda.setFuncionario(funcionario);
        agenda.setAtendimento(atendimentoSalvo);
        agenda.setDataAgenda(dto.getDataHora());
        agenda.setStatus("AGENDADO");

        Agenda agendaSalva = agendaRepo.save(agenda);

        return new AgendamentoResponseDTO(
                atendimentoSalvo,
                agendaSalva,
                "Agendamento criado com sucesso!");
    }

    @Transactional
    public AgendamentoResponseDTO editarAgendamento(Integer agendaId, AgendamentoDto dto) {

        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        Atendimento atendimento = agenda.getAtendimento();

        Medico medico = medicoRepo.findById(dto.getMedicoId())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        Paciente paciente = pacienteRepo.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Funcionario funcionario = funcionarioRepo.findById(dto.getFuncionarioId())
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        if (!atendimento.getDataHora().equals(dto.getDataHora()) ||
                !atendimento.getMedico().getId().equals(dto.getMedicoId())) {

            Integer count = atendimentoRepo.countByMedicoAndDataHora(
                    dto.getMedicoId(), dto.getDataHora());
            if (count > 0) {
                throw new RuntimeException("Médico não disponível neste horário");
            }
        }

        atendimento.setMedico(medico);
        atendimento.setPaciente(paciente);
        atendimento.setDescricao(dto.getDescricao());
        atendimento.setTipo(dto.getTipo());
        atendimento.setPreco(dto.getPreco());
        atendimento.setDataHora(dto.getDataHora());

        Atendimento atendimentoAtualizado = atendimentoRepo.save(atendimento);

        agenda.setFuncionario(funcionario);
        agenda.setDataAgenda(dto.getDataHora());

        Agenda agendaAtualizada = agendaRepo.save(agenda);

        return new AgendamentoResponseDTO(
                atendimentoAtualizado,
                agendaAtualizada,
                "Agendamento atualizado com sucesso!");
    }

    public AgendamentoResponseDTO buscarAgendamentoCompleto(Integer agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        return new AgendamentoResponseDTO(
                agenda.getAtendimento(),
                agenda,
                "Agendamento encontrado");
    }

    @Transactional
    public void confirmarAgendamento(Integer agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new RuntimeException("Agenda não encontrada"));

        agenda.setStatus("CONFIRMADO");
        agendaRepo.save(agenda);
    }

    @Transactional
    public void cancelarAgendamento(Integer agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new RuntimeException("Agenda não encontrada"));

        agenda.setStatus("CANCELADO");
        agendaRepo.save(agenda);

        Atendimento atendimento = agenda.getAtendimento();
        atendimento.setStatus("CANCELADO");
        atendimentoRepo.save(atendimento);
    }

    @Transactional
    public void deletarAgendamento(Integer agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if ("REALIZADO".equals(agenda.getStatus()) || "CONCLUIDO".equals(agenda.getAtendimento().getStatus())) {
            throw new RuntimeException("Não é possível excluir um agendamento já realizado");
        }

        atendimentoRepo.delete(agenda.getAtendimento());
        agendaRepo.delete(agenda);
    }

    @Transactional
    public void realizarAgendamento(Integer agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new RuntimeException("Agenda não encontrada"));

        agenda.setStatus("REALIZADO");
        agendaRepo.save(agenda);

        Atendimento atendimento = agenda.getAtendimento();
        atendimento.setStatus("CONCLUIDO");
        atendimentoRepo.save(atendimento);
    }

}