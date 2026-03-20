const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('../helpers/altenticacao');
const postTransferencia = require('../fixtures/postTransferencia.json');
require('dotenv').config();

describe('Transferencias', () => {
    describe('POST /transferencias', () => {
        let token
        beforeEach(async () => {
            token = await obterToken('julio.lima', '123456')
        })

        it('Deve retornar sucesso 201 quando o valor da transferência for maior ou igual a 10.00', async() => {
            const bodyTransferencia = {...postTransferencia}
            const resposta = await request(process.env.BASE_URL)
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(bodyTransferencia)

            expect(resposta.status).to.equal(201)
            console.log(resposta.body)
        })

        it('Deve retornar falha 422 quando o valor da transferência for menor que 10.00', async() => {
            const bodyTransferencia = {...postTransferencia}
            bodyTransferencia.valor = 7
            const resposta = await request(process.env.BASE_URL)
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(bodyTransferencia)

            expect(resposta.status).to.equal(422)
            console.log(resposta.body)

        })
    })
})