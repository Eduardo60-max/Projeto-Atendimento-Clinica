package com.clinica.clinica_backend.service;

import com.clinica.clinica_backend.model.Funcionario;
import com.clinica.clinica_backend.repository.FuncionarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FuncionarioService {
    private final FuncionarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public FuncionarioService(FuncionarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Funcionario> listarTodos() {
        return repo.findAll();
    }

    public Funcionario buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }

    public Funcionario buscarPorCpf(String cpf) {
        return repo.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Funcionário com CPF " + cpf + " não encontrado"));
    }

    public boolean existePorCpf(String cpf) {
        return repo.existsByCpf(cpf);
    }

    public List<Funcionario> buscarPorCargo(String cargo) {
        return repo.findByCargo(cargo);
    }

    public Funcionario salvar(Funcionario funcionario) {

        if (funcionario.getSenha() != null) {
            funcionario.setSenha(passwordEncoder.encode(funcionario.getSenha()));
        }
        if (funcionario.getId() != null) {
            throw new RuntimeException("Não é permitido enviar ID ao criar um novo funcionário");
        }
        if (existePorCpf(funcionario.getCpf())) {
            throw new RuntimeException("Já existe um funcionário com este CPF");
        }
        return repo.save(funcionario);
    }

    public Funcionario atualizar(Integer id, Funcionario dadosNovos) {
        Funcionario existente = buscarPorId(id);
        existente.setNome(dadosNovos.getNome());
        existente.setTelefone(dadosNovos.getTelefone());
        existente.setCpf(dadosNovos.getCpf());
        existente.setCargo(dadosNovos.getCargo());
        existente.setSalario(dadosNovos.getSalario());

        if (dadosNovos.getSenha() != null && !dadosNovos.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(dadosNovos.getSenha()));
        }

        return repo.save(existente);
    }

    public void deletar(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Funcionário não encontrado");
        }
        repo.deleteById(id);
    }
}