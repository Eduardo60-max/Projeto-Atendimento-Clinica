package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.dto.AgendamentoDto;
import com.clinica.clinica_backend.dto.AgendamentoResponseDTO;
import com.clinica.clinica_backend.service.AgendamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> criarAgendamento(@RequestBody AgendamentoDto dto) {
        try {
            AgendamentoResponseDTO resultado = service.criarAgendamento(dto);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{agendaId}/confirmar")
    public ResponseEntity<?> confirmar(@PathVariable Integer agendaId) {
        try {
            service.confirmarAgendamento(agendaId);
            return ResponseEntity.ok("Agendamento confirmado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{agendaId}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Integer agendaId) {
        try {
            service.cancelarAgendamento(agendaId);
            return ResponseEntity.ok("Agendamento cancelado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{agendaId}/realizar")
    public ResponseEntity<?> realizar(@PathVariable Integer agendaId) {
        try {
            service.realizarAgendamento(agendaId);
            return ResponseEntity.ok("Agendamento marcado como realizado!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{agendaId}")
    public ResponseEntity<?> buscarAgendamento(@PathVariable Integer agendaId) {
        try {
            AgendamentoResponseDTO resultado = service.buscarAgendamentoCompleto(agendaId);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{agendaId}")
    public ResponseEntity<?> editarAgendamento(
            @PathVariable Integer agendaId,
            @RequestBody AgendamentoDto dto) {
        try {
            AgendamentoResponseDTO resultado = service.editarAgendamento(agendaId, dto);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{agendaId}")
    public ResponseEntity<?> deletarAgendamento(@PathVariable Integer agendaId) {
        try {
            service.deletarAgendamento(agendaId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
