package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.model.Emprestimo;
import com.biblioteca.biblioteca.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping
    public Emprestimo criar (@RequestParam Long usuarioId, @RequestParam Long livroId) {
        return emprestimoService.criar(usuarioId, livroId);
    }

    @PutMapping("/{id}/devolver")
    public Emprestimo devolver (@PathVariable Long id) {
        return emprestimoService.devolver(id);
    }
}
