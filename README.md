# 🏦 Banco API Test - Automação de Testes de API

> Projeto de automação construído com Node.js, focado em testar fluxos bancários de uma API Rest, como autenticação de usuário e criação e consulta de transferências.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=Mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=Chai&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-000000?style=for-the-badge&logo=TestingLibrary&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades e Cenários](#-funcionalidades-e-cenários)
- [Tecnologias Utilizadas](#%EF%B8%8F-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#%EF%B8%8F-pré-requisitos)
- [Instalação e Configuração](#%EF%B8%8F-instalação-e-configuração)
- [Executando os Testes](#-executando-os-testes)
- [Relatórios de Teste](#-relatórios-de-teste)

---

## 🎯 Sobre o Projeto

Este projeto tem como objetivo realizar testes automatizados em uma API RESTful de serviços bancários. A arquitetura do projeto foi desenhada para ser modular, facilitando a adição de novos cenários de testes e a manutenção dos testes existentes por meio de padrões como **Fixtures** e **Helpers**.

---

## 🧪 Funcionalidades e Cenários

Os seguintes endpoints e regras de negócio estão cobertos pelos testes:

### 🔐 Autenticação (`POST /login`)
- ✅ Valida se o endpoint retorna `Status 200` e um token do tipo string válido ao enviar credenciais corretas.

### 💸 Transferências (`POST /transferencias`)
- ✅ **Sucesso:** Retorna `Status 201` quando o valor da transferência for maior ou igual a R$ 10,00.
- ❌ **Falha:** Retorna `Status 422` (Unprocessable Entity) quando o valor da transferência for menor que R$ 10,00.

### 🔍 Consulta de Transferência (`GET /transferencias/{id}`)
- ✅ **Sucesso:** Retorna `Status 200` ao consultar uma transferência existente com um ID válido, validando a integridade dos dados retornados: `id`, `valor`, `conta_origem` e `conta_destino`.

---

## 🛠️ Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)** - Ambiente de execução JavaScript.
- **[Mocha](https://mochajs.org/)** - Framework de testes, responsável por organizar os agrupamentos (`describe`) e os casos de teste (`it`).
- **[Chai](https://www.chaijs.com/)** - Biblioteca de asserções BDD/TDD (`expect`).
- **[Supertest](https://github.com/ladjs/supertest)** - Módulo provido para testar requisições HTTP em rotas de forma fluente.
- **[Dotenv](https://github.com/motdotla/dotenv)** - Carregamento de variáveis de ambiente.
- **[Mochawesome](https://github.com/adamgruber/mochawesome)** - Geração de relatórios HTML dinâmicos e visuais.

---

## 📁 Estrutura do Projeto

```plaintext
banco_api_test/
├── fixtures/                    # Armazena os payloads (Mocks/JSONs) utilizados nas requisições
│   ├── postLogin.json
│   └── postTransferencia.json
├── helpers/                     # Funções e métodos de suporte auxiliares
│   └── altenticacao.js          # Função encapsulada para geração e retorno do token de autenticação
├── test/                        # Suíte de testes (Specs)
│   ├── login.test.js            # Cenários de teste de Login
│   └── transferencia.test.js    # Cenários de teste de Transferência
├── mochawesome-report/          # Diretório autogerado com os relatórios de teste HTML/JSON
├── .env                         # Variáveis de ambiente (ex: BASE_URL)
├── .gitignore                   # Arquivos ignorados pelo Git
├── package-lock.json            # Árvore de dependências travadas
└── package.json                 # Configurações do projeto Node e dependências
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão `v14+` recomendada)

---

## ⚙️ Instalação e Configuração

**1. Clone este repositório**
```bash
git clone https://github.com/seu-usuario/banco_api_test.git
```

**2. Acesse a pasta do projeto**
```bash
cd banco_api_test
```

**3. Instale as dependências pacotes**
```bash
npm install
```

**4. Configuração das Variáveis de Ambiente**
Crie um arquivo chamado `.env` na raiz do projeto contendo a Base URL da API que será testada:
```env
BASE_URL=http://url-da-sua-api.com
```

---

## 🚀 Executando os Testes

Este projeto possui scripts via NPM (`package.json`) padronizados.

Para rodar **todos os testes** com timeout configurado e gerar o **relatório automático**:

```bash
npm run test
```

Este comando irá ler e executar todos os arquivos `*.test.js` em recursão dentro da pasta `/test`.

---

## 📊 Relatórios de Teste

A cada execução dos testes através do comando `npm run test`, o projeto gerará uma nova versão do relatório utilizando a biblioteca **Mochawesome**.

Para visualizar:
1. Navegue até a pasta `mochawesome-report/` gerada na raiz do diretório.
2. Abra o arquivo `mochawesome.html` no seu navegador de preferência.

O relatório provê uma interface rica onde você pode visualizar testes com sucesso, testes falhos, durações em milissegundos e logs de erros de asserção.

---

> Desenvolvido com ❤️ e muita qualidade de software!
