package com.clinica.clinica_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SlotAgendaDto {
    private Integer medicoId;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
}