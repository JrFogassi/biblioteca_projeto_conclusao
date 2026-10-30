package com.biblioteca.biblioteca.repository;

import com.biblioteca.biblioteca.model.Multa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MultaRepository extends JpaRepository<Multa,Long>{
    List<Multa> findByEmprestimoUsuarioId(Long usuarioId);
}
