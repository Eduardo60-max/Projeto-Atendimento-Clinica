package com.clinica.clinica_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String email;
    private String cpf;
    private String endereco;
    private String telefone;

    @Column(name = "datanascimento", nullable = false)
    private LocalDate dataNascimento;

    private String sexo;

    @ManyToOne
    @JoinColumn(name = "medicoid", nullable = false)
    private Medico medico;
}
