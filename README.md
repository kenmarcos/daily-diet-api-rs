<!-- CABEÇALHO -->
<div id="readme-top" align="center">
    <h1>
      🥗 Daily Diet API 🥗
    </h1>
    <p>
        <a href="#%EF%B8%8F-sobre-o-projeto">Sobre o Projeto</a> •
        <a href="#-endpoints">Endpoints</a> •
        <a href="#%EF%B8%8F-tecnologias">Tecnologias</a> •
        <a href="#-autor">Autor</a>
    </p>
</div>

<!-- SOBRE O PROJETO -->

## 🖥️ Sobre o Projeto

> Projeto desenvolvido como desafio referente ao módulo Rotas e HTTP da Formação de Node.js da Rocketseat.

Esse projeto consiste em uma aplicação back-end de um sistema de controle de dietas diárias.

As funcionalidades dessa aplicação são:

- [x] Criar um usuário
- [x] Registrar uma refeição feita
- [x] Editar uma refeição
- [x] Apagar uma refeição
- [x] Visualizar uma única refeição
- [x] Obter as métricas de um usuário:
  - [x] Total de refeições registradas
  - [x] Total de refeições dentro da dieta
  - [x] Total de refeições fora da dieta
  - [x] Melhor sequência de refeições dentro da dieta

<!-- ENDPOINTS -->

## 💡 Endpoints

| Método | Endpoint       | Responsabilidade                | Regras de Negócio                                                              |
| ------ | -------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| POST   | /users         | Cria um usuário                 | Dados: `name`, `email`                                                         |
| POST   | /meals         | Cria uma refeição               | Dados: `name`, `description`, `date`, `is_on_diet`                             |
| GET    | /meals/        | Lista todas as refeições        | Lista somente as refeições criadas pelo usuário que está fazendo a requisição  |
| GET    | /meals/:id     | Retorna uma refeição específica | Retorna somente uma refeição criada pelo usuário que está fazendo a requisição |
| PUT    | /meals/:id     | Edita uma refeição              | Somente o usuário que criou a refeição pode editá-la                           |
| DELETE | /meals/:id     | Apaga uma refeição              | Somente o usuário que criou a refeição pode apagá-la                           |
| GET    | /meals/metrics | Retorna as métricas de          | Retorna somente as métricas do usuário que está fazendo a requisição           |

<!-- TECNOLOGIAS -->

## 🛠️ Tecnologias

Para o desenvolvimento desse projeto, as seguintes ferramentas foram utilizadas:

- **[Node.js](https://nodejs.org/)**
- **[Fastify](https://fastify.io/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Knex](https://knexjs.org/)**
- **[Zod](https://zod.dev/)**

## 👨‍💻 Autor

<img style="border-radius: 15%;" src="https://gitlab.com/uploads/-/system/user/avatar/8603970/avatar.png?width=400" width=70 alt="author-profile-picture"/>

Marcos Kenji Kuribayashi

---
