package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.config.JwtUtil;
import com.biblioteca.biblioteca.model.Usuario;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = jwtUtil.gerarToken(usuario);

        return new LoginResponse(token, usuario.getNome(), usuario.getPapel().name());
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String senha;
    }

    @Data
    public static class LoginResponse {
        private final String token;
        private final String nome;
        private final String papel;
    }
}
