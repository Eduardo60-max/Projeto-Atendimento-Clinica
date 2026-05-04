package com.clinica.clinica_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "agenda")
public class Agenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "funcionarioid", nullable = false)
    @JsonIgnoreProperties("agendas")
    private Funcionario funcionario;

    @OneToOne
    @JoinColumn(name = "atendimentoid", nullable = false, unique = true)
    @JsonIgnoreProperties("agenda")
    private Atendimento atendimento;

    @Column(name = "dataagenda")
    private LocalDateTime dataAgenda;

    @Column(length = 20)
    private String status = "AGENDADO";
}