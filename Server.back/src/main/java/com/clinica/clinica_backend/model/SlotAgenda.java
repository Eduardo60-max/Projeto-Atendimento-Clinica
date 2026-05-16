package com.clinica.clinica_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "slotagenda")
public class SlotAgenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Qual médico criou esse horário
    @ManyToOne
    @JoinColumn(name = "medicoid", nullable = false)
    @JsonIgnoreProperties({ "slots", "senha" })
    private Medico medico;

    @Column(name = "datahorainicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "datahorafim", nullable = false)
    private LocalDateTime dataHoraFim;

    // LIVRE, OCUPADO ou CANCELADO
    @Column(length = 20)
    private String status = "LIVRE";

    // Consulta vinculada a esse slot (estou usando null se estiver livre)
    @OneToOne(mappedBy = "slot")
    @JsonIgnoreProperties("slot")
    private Consulta consulta;
}