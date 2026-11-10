package com.biblioteca.biblioteca.service;

import com.biblioteca.biblioteca.model.Multa;
import com.biblioteca.biblioteca.model.Usuario;
import com.biblioteca.biblioteca.repository.MultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MultaService {

    @Autowired
    private MultaRepository multaRepository;

    public List<Multa> listar(Usuario usuario) {
        if (usuario.getPapel() == Usuario.Papel.BIBLIOTECARIO) {
            return multaRepository.findAll();
        }
        return multaRepository.findByEmprestimoUsuarioId(usuario.getId());
    }

    public Multa pagar(Long id) {
        Multa multa = multaRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Multa não encontrada"));
        multa.setPaga(true);
        return multaRepository.save(multa);
    }
}
