package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.model.Enfermeiro;
import com.clinica.clinica_backend.repository.EnfermeiroRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EnfermeiroService {

    private final EnfermeiroRepository repo;
    private final PasswordEncoder passwordEncoder;

    public EnfermeiroService(EnfermeiroRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Enfermeiro> listarTodos() {
        return repo.findAll();
    }

    public Enfermeiro buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Enfermeiro não encontrado"));
    }

    public Enfermeiro buscarPorCoren(String coren) {
        return repo.findByCoren(coren)
                .orElseThrow(() -> new RuntimeException("Enfermeiro com COREN " + coren + " não encontrado"));
    }

    public boolean existePorCoren(String coren) {
        return repo.existsByCoren(coren);
    }

    public Enfermeiro salvar(Enfermeiro enfermeiro) {
        if (enfermeiro.getId() != null) {
            throw new RuntimeException("Não é permitido enviar ID ao criar um novo enfermeiro");
        }
        if (existePorCoren(enfermeiro.getCoren())) {
            throw new RuntimeException("Já existe um enfermeiro com este COREN");
        }
        if (enfermeiro.getSenha() != null) {
            enfermeiro.setSenha(passwordEncoder.encode(enfermeiro.getSenha()));
        }
        return repo.save(enfermeiro);
    }

    public Enfermeiro atualizar(Integer id, Enfermeiro dadosNovos) {
        Enfermeiro existente = buscarPorId(id);
        existente.setNome(dadosNovos.getNome());
        existente.setTelefone(dadosNovos.getTelefone());
        existente.setCoren(dadosNovos.getCoren());
        existente.setCpf(dadosNovos.getCpf());
        existente.setSalario(dadosNovos.getSalario());

        if (dadosNovos.getSenha() != null && !dadosNovos.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(dadosNovos.getSenha()));
        }

        return repo.save(existente);
    }

    public void deletar(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Enfermeiro não encontrado");
        }
        repo.deleteById(id);
    }
}