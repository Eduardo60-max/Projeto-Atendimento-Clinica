package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.dto.SlotAgendaDto;
import com.clinica.clinica_backend.model.SlotAgenda;
import com.clinica.clinica_backend.service.SlotAgendaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotAgendaController {

    private final SlotAgendaService service;

    public SlotAgendaController(SlotAgendaService service) {
        this.service = service;
    }

    // Médico cria um horário livre
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody SlotAgendaDto dto) {
        try {
            SlotAgenda slot = service.criar(dto);
            return ResponseEntity.ok(slot);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Todos os slots de um médico — para o calendário do médico
    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<SlotAgenda>> buscarPorMedico(@PathVariable Integer medicoId) {
        return ResponseEntity.ok(service.buscarPorMedico(medicoId));
    }

    // Slots livres de um médico — para o atendente ver o que pode agendar
    @GetMapping("/medico/{medicoId}/livres")
    public ResponseEntity<List<SlotAgenda>> buscarLivres(@PathVariable Integer medicoId) {
        return ResponseEntity.ok(service.buscarLivresPorMedico(medicoId));
    }

    // Slots de um médico num intervalo — para o calendário mensal
    @GetMapping("/medico/{medicoId}/periodo")
    public ResponseEntity<List<SlotAgenda>> buscarPorPeriodo(
            @PathVariable Integer medicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(service.buscarPorMedicoEMes(medicoId, inicio, fim));
    }

    // Médico cancela um horário livre
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Integer id) {
        try {
            SlotAgenda slot = service.cancelar(id);
            return ResponseEntity.ok(slot);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Deleta um slot (só se estiver LIVRE ou CANCELADO)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Integer id) {
        try {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}