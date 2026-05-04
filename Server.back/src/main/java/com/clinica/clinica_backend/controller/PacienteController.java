package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.model.Paciente;
import com.clinica.clinica_backend.service.PacienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Paciente> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Integer id) {
        try {
            Paciente paciente = service.buscarPorId(id);
            return ResponseEntity.ok(paciente);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Paciente> buscarPorCpf(@PathVariable String cpf) {
        try {
            Paciente paciente = service.buscarPorCpf(cpf);
            return ResponseEntity.ok(paciente);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/existe/{cpf}")
    public ResponseEntity<Boolean> existePorCpf(@PathVariable String cpf) {
        boolean existe = service.existePorCpf(cpf);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<Paciente>> buscarPorMedico(@PathVariable Integer medicoId) {
        try {
            List<Paciente> pacientes = service.buscarPorMedico(medicoId);
            return ResponseEntity.ok(pacientes);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Paciente> criar(@RequestBody Paciente paciente) {
        try {
            Paciente salvo = service.salvar(paciente);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Integer id, @RequestBody Paciente paciente) {
        try {
            Paciente atualizado = service.atualizar(id, paciente);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        try {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}