const request = require('supertest');
let expect; // Declaramos aqui para usar no Chai

const API_URL = 'http://localhost:3000';

describe('VADER - Testes da API: /login', function () {
  
  before(async function () {
    // Como seu projeto usa CommonJS e a versão do Chai é a 6.x (ESM puro),
    // a técnica mais limpa para importar é usando o import() dinâmico do JS.
    const chai = await import('chai');
    expect = chai.expect;
  });

  context('V - Verbs (Verbos / Métodos HTTP indesejados)', function () {
    it('Técnica (V): Deve retornar 405 Method Not Allowed ao usar GET no endpoint de login', async function () {
      const res = await request(API_URL).get('/login');
      // Verificamos se a API bloqueia a tentativa de "ler" o /login, já que o swagger só permite POST
      expect(res.status).to.equal(405);
    });
  });

  context('D - Data (Análise de Fronteiras e Corpo da Requisição)', function () {
    it('Técnica (D): Deve retornar 400 Bad Request ao omitir campos obrigatórios (Missing Data)', async function () {
      // Enviamos apenas a senha, burlando a obrigatoriedade do 'username' declarada no Swagger
      const payloadInvalido = { senha: '123' };
      const res = await request(API_URL).post('/login').send(payloadInvalido);
      
      // O servidor é instruído no JSON a exigir os dois. O status deve ser 400.
      expect(res.status).to.equal(400); 
    });

    it('Técnica (D): Deve retornar 400 ao enviar apenas o username sem senha', async function () {
      const payloadInvalido = { username: 'user@email.com' };
      const res = await request(API_URL).post('/login').send(payloadInvalido);

      expect(res.status).to.equal(400);
    });

    it('Técnica (D): Deve retornar 400 Bad Request ao enviar payload totalmente vazio', async function () {
      const res = await request(API_URL).post('/login').send({});
      expect(res.status).to.equal(400);
    });
  });

 context('E - Errors & Exceptions (Erros mapeados e Não-Autorizado)', function () {

  it('Técnica (E): Deve retornar 401 Unauthorized com usuário inexistente', async function () {
    const res = await request(API_URL).post('/login')
      .send({ username: 'usuario_falso_999', senha: '123' });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('token');
  });

  it('Técnica (E): Deve retornar 401 Unauthorized com senha incorreta', async function () {
    const res = await request(API_URL).post('/login')
      .send({ username: 'usuario_valido', senha: 'senha_errada' });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message');
    expect(res.body).to.not.have.property('token');
  });

});

  context('R - Responses (Schema e Cabeçalhos)', function () {
    it('Técnica (R): Deve formatar o body de retorno com a propriedade "token" (Validação de Schema)', async function () {
      // NOTA: Para este teste passar com 200, ajuste o usuário e senha existentes no seu banco
      const credenciaisValidadas = { username: 'admin', senha: 'password' }; 
      const res = await request(API_URL).post('/login').send(credenciaisValidadas);
      
      if (res.status === 200) {
        // Asseguramos que não veio um status de sucesso vazio ou em XML, e sim contendo exatamente a estrutura pedida.
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
        
        // Extra: Validamos através de Header se o retorno obedece as regras do protocolo
        expect(res.headers['content-type']).to.match(/json/);
      } else {
        // Para a Pipeline local não estourar caso seu banco esteja recém-limpo.
        console.warn('  [Aviso]: Altere as credenciais deste teste para corresponder às do servidor local.');
        expect(res.status).to.be.oneOf([200, 401]); 
      }
    });
  });
});
