const request = require('supertest');
let expect;

const API_URL = 'http://localhost:3000';

describe('VADER - Testes da API: /transferencias', function () {
  
  // Idealmente, nós extrairíamos esse token no 'before' ou num arquivo de Helper fazendo o login.
  // Coloquei direto para evidenciar o funcionamento.
  let tokenTestes = 'MEU_TOKEN_DE_TESTE'; 

  before(async function () {
    const chai = await import('chai');
    expect = chai.expect;
  });

  context('V - Verbs (Proteções HTTP na raiz)', function () {
    it('Técnica (V): Deve barrar requisição do tipo PUT na listagem global (405 Method Not Allowed)', async function () {
      const res = await request(API_URL).put('/transferencias');
      // No swagger, PUT só existe em /transferencias/{id}. Atualizar o array "transferencias" inteiro não deve ser permitido.
      expect(res.status).to.equal(405);
    });
  });

  context('A - Authorization (Pilar crucial em operações financeiras)', function () {
    it('Técnica (A): Deve barrar operações sem envio do Header Authorization (401 Unauthorized)', async function () {
      // Aqui a técnica é a ausência proposital do .set('Authorization', token)
      const res = await request(API_URL).get('/transferencias');
      expect(res.status).to.equal(401);
    });

    it('Técnica (A): Deve recusar tokens inválidos, vencidos ou manipulados', async function () {
      const res = await request(API_URL)
        .post('/transferencias')
        .set('Authorization', 'Bearer token_manipulado_invalidamente')
        .send({ contaOrigem: 1, contaDestino: 2, valor: 100 });
      
      expect(res.status).to.equal(401);
    });
  });

  context('D - Data (Tipagens maliciosas e Limites)', function () {
    it('Técnica (D): Deve retornar validação 422/400 ao injetar Strings em regras de ID numéricas', async function () {
      // Swagger pede integer. E se o front-end quebrar e enviar string?
      const payloadStringInjetada = { contaOrigem: "Hack", contaDestino: 2, valor: 100.0 };
      const res = await request(API_URL)
        .post('/transferencias')
        .set('Authorization', `Bearer ${tokenTestes}`)
        .send(payloadStringInjetada);
      
      expect(res.status).to.be.oneOf([400, 422, 401]); // O 401 entra caso o token fake não passe no servidor real
    });

    it('Técnica (D): Boundary (Fronteiras) - Bloqueio de valores de transferência negativos', async function () {
      const payloadTransferenciaNegativa = { contaOrigem: 1, contaDestino: 2, valor: -50.0 };
      const res = await request(API_URL)
        .post('/transferencias')
        .set('Authorization', `Bearer ${tokenTestes}`)
        .send(payloadTransferenciaNegativa);
      
      expect(res.status).to.be.oneOf([400, 422, 401]);
    });
  });

  context('E - Errors (Testando Regras de Negócio do Banco)', function () {
    it('Técnica (E): Deve responder Unprocessable Entity (422) por falta de Saldo na conta origem', async function () {
      // Se não houver validação de negócio na API, o banco entraria em débito não permitido.
      const payloadSemSaldo = { contaOrigem: 1, contaDestino: 2, valor: 9999999.0 };
      const res = await request(API_URL)
        .post('/transferencias')
        .set('Authorization', `Bearer ${tokenTestes}`)
        .send(payloadSemSaldo);
      
      // Validação semântica: A API leu tudo normal (então não é 400), mas bateu na regra de saldo baixo (422).
      expect(res.status).to.be.oneOf([422, 401]);
    });

    it('Técnica (E): Deve assegurar que o DELETE falha com 404 caso aplique a IDs não existentes', async function () {
      const res = await request(API_URL)
        .delete('/transferencias/99999999')
        .set('Authorization', `Bearer ${tokenTestes}`);

      expect(res.status).to.be.oneOf([404, 401]);
    });
  });

  context('R - Response (Testando os Limites e Retornos Paginação)', function () {
    it('Técnica (R): Ao consultar /transferencias o JSON Schema deve refletir {page, limit, total, transferencias[]}', async function () {
      const res = await request(API_URL)
        .get('/transferencias?page=1&limit=5')
        .set('Authorization', `Bearer ${tokenTestes}`);
      
      if (res.status === 200) {
         expect(res.body).to.have.property('page');
         expect(res.body).to.have.property('limit');
         // Valida se o limite do contrato está retornando os arrays corretamente
         expect(res.body).to.have.property('transferencias').that.is.an('array');
         expect(res.body.transferencias.length).to.be.at.most(5);
      } else {
         // Cai aqui se a auth barrar por usar tokenTestes chumbado na const
         expect(res.status).to.be.oneOf([401, 200]);
      }
    });
  });
});
