package com.clinica.clinica_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "consulta")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // O slot de horário que essa consulta ocupa
    @OneToOne
    @JoinColumn(name = "slotid", nullable = false, unique = true)
    @JsonIgnoreProperties("consulta")
    private SlotAgenda slot;

    // Paciente da consulta
    @ManyToOne
    @JoinColumn(name = "pacienteid", nullable = false)
    @JsonIgnoreProperties({ "consultas", "medico" })
    private Paciente paciente;

    // Funcionário que fez o agendamento
    @ManyToOne
    @JoinColumn(name = "funcionarioid", nullable = false)
    @JsonIgnoreProperties("consultas")
    private Funcionario funcionario;

    @Column(length = 50)
    private String tipo;

    private BigDecimal preco;

    // AGENDADO, REALIZADO ou CANCELADO
    @Column(length = 20)
    private String status = "AGENDADO";

    // Prontuário gerado após a consulta
    @OneToOne(mappedBy = "consulta")
    @JsonIgnoreProperties("consulta")
    private Prontuario prontuario;
}