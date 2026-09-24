package com.biblioteca.biblioteca.service;

import com.biblioteca.biblioteca.model.Emprestimo;
import com.biblioteca.biblioteca.model.Livro;
import com.biblioteca.biblioteca.model.Multa;
import com.biblioteca.biblioteca.model.Usuario;
import com.biblioteca.biblioteca.repository.EmprestimoRepository;
import com.biblioteca.biblioteca.repository.LivroRepository;
import com.biblioteca.biblioteca.repository.MultaRepository;
import com.biblioteca.biblioteca.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EmprestimoService {

    private static final int DIAS_EMPRESTIMO = 7;
    private static final BigDecimal VALOR_MULTA_POR_DIA = new BigDecimal("0.50");

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MultaRepository multaRepository;

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    public Emprestimo criar(Long usuarioId, Long livroId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Livro livro = livroRepository.findById(livroId).orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        if (livro.getQuantidadeDisponivel() <= 0) {
            throw new RuntimeException("Livro sem exemplares disponíveis");
        }

        livro.setQuantidadeDisponivel(livro.getQuantidadeDisponivel() -1);
        livroRepository.save(livro);

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setLivro(livro);
        emprestimo.setDataRetirada(LocalDate.now());
        emprestimo.setDataPrevistaDevolucao(LocalDate.now().plusDays(DIAS_EMPRESTIMO));
        emprestimo.setStatus(Emprestimo.Status.ATIVO);

        return emprestimoRepository.save(emprestimo);

    }

    public Emprestimo devolver(Long emprestimoId) {
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId).orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));

        LocalDate hoje = LocalDate.now();
        emprestimo.setDataDevolucao(hoje);

        Livro livro = emprestimo.getLivro();
        livro.setQuantidadeDisponivel(livro.getQuantidadeDisponivel() + 1);
        livroRepository.save(livro);

        if (hoje.isAfter(emprestimo.getDataPrevistaDevolucao())) {
            emprestimo.setStatus(Emprestimo.Status.ATRASADO);

            long diasAtraso = ChronoUnit.DAYS.between(emprestimo.getDataPrevistaDevolucao(), hoje);
            BigDecimal valorMulta = VALOR_MULTA_POR_DIA.multiply(BigDecimal.valueOf(diasAtraso));

            Multa multa = new Multa();
            multa.setEmprestimo(emprestimo);
            multa.setValor(valorMulta);
            multa.setPaga(false);
            multa.setDataGeracao(hoje);
            multaRepository.save(multa);
        } else {
            emprestimo.setStatus(Emprestimo.Status.DEVOLVIDO);
        }

        return emprestimoRepository.save(emprestimo);
    }
}
