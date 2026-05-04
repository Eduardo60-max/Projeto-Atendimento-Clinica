package com.clinica.clinica_backend.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.clinica.clinica_backend.config.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    private Key getChave() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    public String gerarToken(Integer id, String nome, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("nome", nome);
        claims.put("role", role);
        claims.put("id", id);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(id))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiracao()))
                .signWith(getChave())
                .compact();
    }

    private Claims extrairClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getChave())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extrairRole(String token) {
        return extrairClaims(token).get("role", String.class);
    }

    public String extrairId(String token) {
        return extrairClaims(token).getSubject();
    }
}