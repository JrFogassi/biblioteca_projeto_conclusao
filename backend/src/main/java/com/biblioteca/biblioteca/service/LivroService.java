package com.biblioteca.biblioteca.service;

import com.biblioteca.biblioteca.model.Livro;
import com.biblioteca.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    @Autowired
    private  LivroRepository livroRepository;

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public Optional<Livro> buscarPorId(Long id) {
        return livroRepository.findById(id);
    }

    public Livro salvar(Livro livro) {
        livro.setQuantidadeDisponivel(livro.getQuantidadeTotal());
        return livroRepository.save(livro);
    }

    public Livro atualizar(Long id, Livro dadosAtualizados) {
        Livro livro = livroRepository.findById(id).orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        livro.setTitulo(dadosAtualizados.getTitulo());
        livro.setAutor(dadosAtualizados.getAutor());
        livro.setIsbn(dadosAtualizados.getIsbn());
        livro.setCategoria(dadosAtualizados.getCategoria());
        livro.setQuantidadeTotal(livro.getQuantidadeTotal());

        return livroRepository.save(livro);
    }

    public void deletar(Long id) {
        livroRepository.deleteById(id);
    }
}
