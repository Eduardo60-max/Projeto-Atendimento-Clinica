package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.model.Atendimento;
import com.clinica.clinica_backend.service.AtendimentoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*")
public class AtendimentoController {

    private final AtendimentoService service;

    public AtendimentoController(AtendimentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Atendimento> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atendimento> buscarPorId(@PathVariable Integer id) {
        try {
            Atendimento atendimento = service.buscarPorId(id);
            return ResponseEntity.ok(atendimento);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<Atendimento>> buscarPorMedico(@PathVariable Integer medicoId) {
        try {
            List<Atendimento> atendimentos = service.buscarPorMedico(medicoId);
            return ResponseEntity.ok(atendimentos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Atendimento>> buscarPorPaciente(@PathVariable Integer pacienteId) {
        try {
            List<Atendimento> atendimentos = service.buscarPorPaciente(pacienteId);
            return ResponseEntity.ok(atendimentos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Atendimento>> buscarPorStatus(@PathVariable String status) {
        try {
            List<Atendimento> atendimentos = service.buscarPorStatus(status);
            return ResponseEntity.ok(atendimentos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/disponibilidade/{medicoId}")
    public ResponseEntity<Boolean> verificarDisponibilidade(
            @PathVariable Integer medicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataHora) {
        try {
            boolean disponivel = service.verificarDisponibilidade(medicoId, dataHora);
            return ResponseEntity.ok(disponivel);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarAtendimento(@PathVariable Integer id) {
        try {
            service.cancelarAtendimento(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Integer id) {
        try {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}