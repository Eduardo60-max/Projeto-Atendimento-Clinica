package com.clinica.clinica_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "prontuario")
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Consulta à qual esse prontuário pertence
    @OneToOne
    @JoinColumn(name = "consultaid", nullable = false, unique = true)
    @JsonIgnoreProperties("prontuario")
    private Consulta consulta;

    @ManyToOne
    @JoinColumn(name = "medicoid", nullable = false)
    @JsonIgnoreProperties({ "slots", "senha" })
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "pacienteid", nullable = false)
    @JsonIgnoreProperties("consultas")
    private Paciente paciente;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "dataregistro")
    private LocalDate dataRegistro = LocalDate.now();
}