package com.biblioteca.biblioteca.config;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;


@Component
public class JwtUtil {
    private final SecretKey chave = Keys.hmacShaKeyFor (
            "chave-secreta-provisoria-1234567890".getBytes()
    );
}

