package com.clinica.clinica_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "atendimento")
public class Atendimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "medicoid", nullable = false)
    @JsonIgnoreProperties({ "atendimentos", "pacientes" })
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "pacienteid", nullable = false)
    @JsonIgnoreProperties({ "atendimentos", "medico" })
    private Paciente paciente;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(length = 50)
    private String tipo;

    private BigDecimal preco;

    @Column(name = "datahora")
    private LocalDateTime dataHora;

    @Column(length = 20)
    private String status = "ATIVO";

    @OneToOne(mappedBy = "atendimento")
    @JsonIgnoreProperties("atendimento")
    private Agenda agenda;
}