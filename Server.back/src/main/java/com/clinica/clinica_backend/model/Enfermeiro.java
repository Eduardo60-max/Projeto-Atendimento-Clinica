package com.clinica.clinica_backend.model;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "enfermeiro")
public class Enfermeiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String telefone;

    @Column(unique = true)
    private String coren; // aparentemente isso é o crm dos enfermeiros

    private String cpf;
    private BigDecimal salario;
    private String senha;
}