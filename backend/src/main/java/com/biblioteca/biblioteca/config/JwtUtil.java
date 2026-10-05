package com.biblioteca.biblioteca.config;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;


@Component
public class JwtUtil {
    private final SecretKey chave = Keys.hmacShaKeyFor (
            "chave-secreta-provisoria-1234567890".getBytes()
    );

    private final long EXPIRACAO_MS = 1000 * 60 * 60 * 10;

    public String gerarToken(UserDetails userDetails) {
        return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + EXPIRACAO_MS)).signWith(chave).compact();
    }

    public String extrairEmail(String token) {
        return Jwts.parser().verifyWith(chave).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean tokenValido(String token, UserDetails userDetails) {
        String email = extrairEmail(token);
        return email.equals(userDetails.getUsername()) && !tokenExpirado(token);
    }

    private boolean tokenExpirado(String token) {
        Date expiracao = Jwts.parser().verifyWith(chave).build().parseSignedClaims(token).getPayload().getExpiration();
        return expiracao.before(new Date());
    }
}

