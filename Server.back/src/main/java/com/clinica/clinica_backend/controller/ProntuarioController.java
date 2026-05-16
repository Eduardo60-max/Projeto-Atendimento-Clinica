package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.dto.ProntuarioDto;
import com.clinica.clinica_backend.model.Prontuario;
import com.clinica.clinica_backend.service.ProntuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prontuarios")
@CrossOrigin(origins = "*")
public class ProntuarioController {

    private final ProntuarioService service;

    public ProntuarioController(ProntuarioService service) {
        this.service = service;
    }

    // Médico cria ou edita o prontuário de uma consulta
    @PostMapping
    public ResponseEntity<?> salvarOuAtualizar(@RequestBody ProntuarioDto dto) {
        try {
            Prontuario prontuario = service.salvarOuAtualizar(dto);
            return ResponseEntity.ok(prontuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Prontuário de uma consulta específica
    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity<?> buscarPorConsulta(@PathVariable Integer consultaId) {
        try {
            return ResponseEntity.ok(service.buscarPorConsulta(consultaId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Histórico de prontuários de um paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Prontuario>> buscarPorPaciente(@PathVariable Integer pacienteId) {
        return ResponseEntity.ok(service.buscarPorPaciente(pacienteId));
    }

    // Todos os prontuários escritos por um médico
    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<Prontuario>> buscarPorMedico(@PathVariable Integer medicoId) {
        return ResponseEntity.ok(service.buscarPorMedico(medicoId));
    }
}