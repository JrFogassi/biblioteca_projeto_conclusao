package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.model.Multa;
import com.biblioteca.biblioteca.model.Usuario;
import com.biblioteca.biblioteca.service.MultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/multas")
public class MultaController {

    @Autowired
    private MultaService multaService;

    @GetMapping
    public List<Multa> listar(@AuthenticationPrincipal Usuario usuario) {
        return multaService.listar(usuario);
    }

    @PutMapping("/{id}/pagar")
    public Multa pagar(@PathVariable Long id) {
        return multaService.pagar(id);
    }
}
