package com.clinica.clinica_backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AgendamentoDto {

    private Integer id;
    private Integer medicoId;
    private Integer pacienteId;
    private Integer funcionarioId;

    private String descricao;
    private String tipo;
    private BigDecimal preco;
    private LocalDateTime dataHora;
}