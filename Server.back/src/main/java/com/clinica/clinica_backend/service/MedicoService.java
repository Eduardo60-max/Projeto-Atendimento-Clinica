package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.model.Medico;
import com.clinica.clinica_backend.repository.MedicoRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicoService {
    private final MedicoRepository repo;
    private final PasswordEncoder passwordEncoder;

    public MedicoService(MedicoRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Medico> listarTodos() {
        return repo.findAll();
    }

    public Medico buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));
    }

    public Medico buscarPorCrm(String crm) {
        return repo.findByCrm(crm)
                .orElseThrow(() -> new RuntimeException("Médico com CRM " + crm + " não encontrado"));
    }

    public boolean existePorCrm(String crm) {
        return repo.findByCrm(crm).isPresent();
    }

    public Medico salvar(Medico medico) {

        if (medico.getSenha() != null) {
            medico.setSenha(passwordEncoder.encode(medico.getSenha()));
        }

        if (medico.getId() != null) {
            throw new RuntimeException("Não é permitido enviar ID ao criar um novo médico");
        }
        if (existePorCrm(medico.getCrm())) {
            throw new RuntimeException("Já existe um médico com este CRM");
        }
        return repo.save(medico);
    }

    public Medico atualizar(Integer id, Medico dadosNovos) {
        Medico existente = buscarPorId(id);
        existente.setNome(dadosNovos.getNome());
        existente.setTelefone(dadosNovos.getTelefone());
        existente.setCrm(dadosNovos.getCrm());
        existente.setEspecialidade(dadosNovos.getEspecialidade());
        existente.setSalario(dadosNovos.getSalario());

        // Só atualiza a senha se uma nova foi enviada
        if (dadosNovos.getSenha() != null && !dadosNovos.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(dadosNovos.getSenha()));
        }

        return repo.save(existente);
    }

    public void deletar(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Médico não encontrado");
        }
        repo.deleteById(id);
    }
}
