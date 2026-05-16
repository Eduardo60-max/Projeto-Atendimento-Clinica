package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.dto.ConsultaDto;
import com.clinica.clinica_backend.model.Consulta;
import com.clinica.clinica_backend.service.ConsultaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {

    private final ConsultaService service;

    public ConsultaController(ConsultaService service) {
        this.service = service;
    }

    // Atendente agenda uma consulta
    @PostMapping
    public ResponseEntity<?> agendar(@RequestBody ConsultaDto dto) {
        try {
            Consulta consulta = service.agendar(dto);
            return ResponseEntity.ok(consulta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Médico marca a consulta como realizada
    @PutMapping("/{id}/realizar")
    public ResponseEntity<?> realizar(@PathVariable Integer id) {
        try {
            Consulta consulta = service.realizar(id);
            return ResponseEntity.ok(consulta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cancelar consulta — libera o slot
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Integer id) {
        try {
            Consulta consulta = service.cancelar(id);
            return ResponseEntity.ok(consulta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Todas as consultas de um médico
    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<Consulta>> buscarPorMedico(@PathVariable Integer medicoId) {
        return ResponseEntity.ok(service.buscarPorMedico(medicoId));
    }

    // Todas as consultas de um paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Consulta>> buscarPorPaciente(@PathVariable Integer pacienteId) {
        return ResponseEntity.ok(service.buscarPorPaciente(pacienteId));
    }
}