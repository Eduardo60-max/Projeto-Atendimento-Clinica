package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.model.Agenda;
import com.clinica.clinica_backend.service.AgendaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/agendas")
@CrossOrigin(origins = "*")
public class AgendaController {

    private final AgendaService service;

    public AgendaController(AgendaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Agenda> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agenda> buscarPorId(@PathVariable Integer id) {
        try {
            Agenda agenda = service.buscarPorId(id);
            return ResponseEntity.ok(agenda);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/atendimento/{atendimentoId}")
    public ResponseEntity<Agenda> buscarPorAtendimento(@PathVariable Integer atendimentoId) {
        try {
            Agenda agenda = service.buscarPorAtendimento(atendimentoId);
            return ResponseEntity.ok(agenda);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/funcionario/{funcionarioId}")
    public ResponseEntity<List<Agenda>> buscarPorFuncionario(@PathVariable Integer funcionarioId) {
        try {
            List<Agenda> agendas = service.buscarPorFuncionario(funcionarioId);
            return ResponseEntity.ok(agendas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<Agenda>> buscarPorMedico(@PathVariable Integer medicoId) {
        try {
            List<Agenda> agendas = service.buscarPorMedico(medicoId);
            return ResponseEntity.ok(agendas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Agenda>> buscarPorStatus(@PathVariable String status) {
        try {
            List<Agenda> agendas = service.buscarPorStatus(status);
            return ResponseEntity.ok(agendas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dia")
    public ResponseEntity<List<Agenda>> buscarAgendamentosDoDia(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        try {
            List<Agenda> agendas = service.buscarAgendamentosDoDia(data);
            return ResponseEntity.ok(agendas);
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