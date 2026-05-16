package com.clinica.clinica_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ConsultaDto {
    private Integer slotId; // horário q será ocupado
    private Integer pacienteId;
    private Integer funcionarioId; // quem á fazendo o agendamento
    private String tipo;
    private BigDecimal preco;
}