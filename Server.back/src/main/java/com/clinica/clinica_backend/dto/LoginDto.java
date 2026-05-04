package com.clinica.clinica_backend.dto;

import lombok.Data;

@Data

public class LoginDto {
    private String identificador;
    private String senha;
    private String tipo;
}
