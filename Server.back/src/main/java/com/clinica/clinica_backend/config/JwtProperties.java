package com.clinica.clinica_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")

public class JwtProperties {
    private String secret;
    private long expiracao;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiracao() {
        return expiracao;
    }

    public void setExpiracao(long expiracao) {
        this.expiracao = expiracao;
    }
}
