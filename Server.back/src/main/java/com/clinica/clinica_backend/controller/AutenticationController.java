package com.clinica.clinica_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.clinica_backend.dto.LoginDto;
import com.clinica.clinica_backend.model.Funcionario;
import com.clinica.clinica_backend.model.Medico;
import com.clinica.clinica_backend.service.FuncionarioService;
import com.clinica.clinica_backend.service.JwtService;
import com.clinica.clinica_backend.service.MedicoService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AutenticationController {

    private final MedicoService medicoService;
    private final FuncionarioService funcionarioService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AutenticationController(MedicoService medicoService,
            FuncionarioService funcionarioService,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {
        this.medicoService = medicoService;
        this.funcionarioService = funcionarioService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {

        if ("MEDICO".equalsIgnoreCase(dto.getTipo())) {
            try {

                Medico medico = medicoService.buscarPorCrm(dto.getIdentificador());

                boolean senhaCorreta = passwordEncoder.matches(dto.getSenha(), medico.getSenha());

                if (!senhaCorreta) {

                    return ResponseEntity.status(401).body("Credenciais inválidas");
                }

                String token = jwtService.gerarToken(medico.getId(), medico.getNome(), "MEDICO");

                Map<String, Object> resposta = new HashMap<>();
                resposta.put("token", token);
                resposta.put("role", "MEDICO");
                resposta.put("nome", medico.getNome());
                resposta.put("id", medico.getId());

                return ResponseEntity.ok(resposta);

            } catch (RuntimeException e) {
                return ResponseEntity.status(401).body("Credenciais inválidas");
            }

        } else if ("ATENDENTE".equalsIgnoreCase(dto.getTipo())) {
            try {
                Funcionario funcionario = funcionarioService.buscarPorCpf(dto.getIdentificador());

                boolean senhaCorreta = passwordEncoder.matches(dto.getSenha(), funcionario.getSenha());

                if (!senhaCorreta) {
                    return ResponseEntity.status(401).body("Credenciais inválidas");
                }

                String token = jwtService.gerarToken(
                        funcionario.getId(), funcionario.getNome(), "ATENDENTE");

                Map<String, Object> resposta = new HashMap<>();
                resposta.put("token", token);
                resposta.put("role", "ATENDENTE");
                resposta.put("nome", funcionario.getNome());
                resposta.put("id", funcionario.getId());

                return ResponseEntity.ok(resposta);

            } catch (RuntimeException e) {
                return ResponseEntity.status(401).body("Credenciais inválidas");
            }

        } else {
            return ResponseEntity.badRequest().body("Tipo inválido. Use MEDICO ou ATENDENTE.");
        }
    }
}