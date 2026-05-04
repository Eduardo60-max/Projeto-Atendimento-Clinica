package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.model.Medico;
import com.clinica.clinica_backend.service.MedicoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    private final MedicoService service;

    public MedicoController(MedicoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Medico> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarPorId(@PathVariable Integer id) {
        try {
            Medico medico = service.buscarPorId(id);
            return ResponseEntity.ok(medico);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/crm/{crm}")
    public ResponseEntity<Medico> buscarPorCrm(@PathVariable String crm) {
        try {
            Medico medico = service.buscarPorCrm(crm);
            return ResponseEntity.ok(medico);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/existe/{crm}")
    public ResponseEntity<Boolean> existePorCrm(@PathVariable String crm) {
        boolean existe = service.existePorCrm(crm);
        return ResponseEntity.ok(existe);
    }

    @PostMapping
    public ResponseEntity<Medico> criar(@RequestBody Medico medico) {
        try {
            Medico salvo = service.salvar(medico);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medico> atualizar(@PathVariable Integer id, @RequestBody Medico medico) {
        try {
            Medico atualizado = service.atualizar(id, medico);
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
