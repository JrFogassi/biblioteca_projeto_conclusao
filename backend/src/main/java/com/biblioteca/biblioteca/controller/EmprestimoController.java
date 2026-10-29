package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.model.Emprestimo;
import com.biblioteca.biblioteca.model.Usuario;
import com.biblioteca.biblioteca.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {

    @Autowired
    private EmprestimoService emprestimoService;

    @GetMapping
    public List<Emprestimo> listarTodos() {
        return emprestimoService.listarTodos();
    }

    @GetMapping("/meus")
    public List<Emprestimo> meus(@AuthenticationPrincipal
    Usuario usuario) {
        return emprestimoService.listarPorUsuario(usuario.getId());
    }

    @PostMapping
    public Emprestimo criar(@RequestParam Long livroId, @AuthenticationPrincipal Usuario usuario) {
        return emprestimoService.criar(usuario.getId(), livroId);
    }

    @PutMapping("/{id}/devolver")
    public Emprestimo devolver(@PathVariable Long id) {
        return emprestimoService.devolver(id);
    }
}