package com.clinica.clinica_backend.dto;

import com.clinica.clinica_backend.model.Agenda;
import com.clinica.clinica_backend.model.Atendimento;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoResponseDTO {
    private Atendimento atendimento;
    private Agenda agenda;
    private String mensagem;
}