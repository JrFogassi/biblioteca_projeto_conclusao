# Sistema de Gestão de Biblioteca

Projeto de conclusão do curso técnico FullStack da Codifica Edu e +praTi, desenvolvido de forma individual por mim, Júnior Fogassi.
Aplicação web para gerenciar o acervo de uma biblioteca: cadastro de livros, empréstimos, devoluções e cobrança automática de multa por atraso, com dois perfis de acesso (leitor e bibliotecário).

## Tecnologias 
**Back-end:** Java 17, Spring Boot, Spring Security com JWT, Spring Data JPA e Maven.
**Front-end:** React, Typescript, Vite, Tailwind CSS, React Router e Axios.
*Banco de dados:* PostgreSQL

## Funcionalidades
- Cadastro e login de usuários, com senha criptografada (BCrypt) e autenticação por token JWT (com validade de 10 horas).
- Dois perfis de acesso:
- **Leitor:** consulta o acervo, pega livros emprestados, devolve e acompanha suas multas.
- **Bibliotecário:** tudo o que o leitor faz, além de cadastrar, editar e excluir livros, ver as multas de todos e registrar pagamentos.
- Controle de estoque: o empréstimo reduz a quantidade disponível e a devolução devolve o exemplar.
- Multa automática por atraso na devolução.

## Regras de negócio
- Prazo de empréstimo: 7 dias.
- Multa por atraso: R$ 0,50 por dia.
- Só é possível emprestar um livro com exemplares disponíveis.
- Um empréstimo só pode ser devolvido pelo próprio leitor ou por um bibliotecário, e apenas uma vez.
- O cadastro público sempre cria usuários com perfil de leitor.
  
## Como executar

### Pré-requisitos

- JDK 17 ou superior.
- Node.js (versão LTS recente).
- PostgreSQL.

### 1. Banco de dados
Crie um banco chamado `biblioteca` no PostgreSQL. As tabelas são criadas automaticamente na primeira execução do back-end.

### 2. Back-end
Confira usuário e senha do seu PostgreSQL em `backend/src/main/resources/application.properties`. Depois:
```bash
cd backend
./mvnw spring-boot:run
```
A API sobe em `http://localhost:8080`.

### 3. Front-end
```bash
cd frontend
npm install
npm run dev
```
A aplicação vai abrir em `http://localhost:5137`.

### 4. Criando o primeiro bibliotecário

O cadastro pela tela cria apenas leitores. Para ter um bibliotecário, crie uma conta normalmente e modifique no banco:
```sql
UPDATE usuario SET papel = 'BIBLIOTECARIO' WHERE email = 'seu@email.com';
```

Depois, saia e entre novamente do sistema.

## Endpoints da API
| Método | Rota | Acesso |
|  POST   | `/api/auth/login` | Público 
|  POST   | `/api/usuarios`   | Público (cadastro do leitor)
|  GET    | `/api/livros`     | Usuário logado
| POST, PUT, DELETE | `/api/livros` | Bibliotecário 
| POST | `/api/emprestimos?livroId=` | Usuário logado
| GET | `/api/emprestimos/meus` | Usuário logado
| GET | `/api/emprestimos` | Bibliotecário
| PUT | `/api/emprestimos/{id}/devolver` | Dono do empréstimo ou bibliotecário 
| GET | `/api/multas` | Usuário logado (leitor vê as suas, bibliotecário vê todas)
| PUT | `/api/multas/{id}/pagas` | Bibliotecário

## Estrutura do projeto
```
├── backend/     API REST em Spring Boot
└── frontend/    Interface em React
```

## OBS: Limitação:
- A chave de assinatura do JWT está fixa no código; em produção deveria vir de variável de ambiente.
