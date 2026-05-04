package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.model.Paciente;
import com.clinica.clinica_backend.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PacienteService {
    private final PacienteRepository repo;

    public PacienteService(PacienteRepository repo) {
        this.repo = repo;
    }

    public List<Paciente> listarTodos() {
        return repo.findAll();
    }

    public Paciente buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
    }

    public Paciente buscarPorCpf(String cpf) {
        return repo.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Paciente com CPF " + cpf + " não encontrado"));
    }

    public boolean existePorCpf(String cpf) {
        return repo.findByCpf(cpf).isPresent();
    }

    public List<Paciente> buscarPorMedico(Integer medicoId) {
        return repo.findByMedicoId(medicoId);
    }

    public Paciente salvar(Paciente paciente) {

        if (paciente.getId() != null) {
            throw new RuntimeException("Não é permitido enviar ID ao criar um novo paciente");
        }
        if (existePorCpf(paciente.getCpf())) {
            throw new RuntimeException("Já existe um paciente com este CPF");
        }
        return repo.save(paciente);
    }

    public Paciente atualizar(Integer id, Paciente paciente) {
        Paciente existente = buscarPorId(id);

        repo.findByCpf(paciente.getCpf()).ifPresent(outro -> {
            if (!outro.getId().equals(id)) {
                throw new RuntimeException("Já existe outro paciente com este CPF");
            }
        });

        existente.setNome(paciente.getNome());
        existente.setCpf(paciente.getCpf());
        existente.setEmail(paciente.getEmail());
        existente.setEndereco(paciente.getEndereco());
        existente.setTelefone(paciente.getTelefone());
        existente.setDataNascimento(paciente.getDataNascimento());
        existente.setSexo(paciente.getSexo());
        existente.setMedico(paciente.getMedico());

        return repo.save(existente);
    }

    public void deletar(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Paciente não encontrado");
        }
        repo.deleteById(id);
    }
}