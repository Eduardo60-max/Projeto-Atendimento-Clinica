package com.clinica.clinica_backend.controller;

import com.clinica.clinica_backend.model.Enfermeiro;
import com.clinica.clinica_backend.service.EnfermeiroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enfermeiros")
@CrossOrigin(origins = "*")
public class EnfermeiroController {

    private final EnfermeiroService service;

    public EnfermeiroController(EnfermeiroService service) {
        this.service = service;
    }

    @GetMapping
    public List<Enfermeiro> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enfermeiro> buscarPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/coren/{coren}")
    public ResponseEntity<Enfermeiro> buscarPorCoren(@PathVariable String coren) {
        try {
            return ResponseEntity.ok(service.buscarPorCoren(coren));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/existe/{coren}")
    public ResponseEntity<Boolean> existePorCoren(@PathVariable String coren) {
        return ResponseEntity.ok(service.existePorCoren(coren));
    }

    @PostMapping
    public ResponseEntity<Enfermeiro> criar(@RequestBody Enfermeiro enfermeiro) {
        try {
            return ResponseEntity.ok(service.salvar(enfermeiro));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enfermeiro> atualizar(@PathVariable Integer id,
            @RequestBody Enfermeiro enfermeiro) {
        try {
            return ResponseEntity.ok(service.atualizar(id, enfermeiro));
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