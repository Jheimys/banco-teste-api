const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('../helpers/altenticacao');
const postTransferencia = require('../fixtures/postTransferencia.json');
require('dotenv').config();

describe('Transferencias', () => {
    let token
    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456')
    })

    describe('POST /transferencias', () => {

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

    describe('GET /transferencias/{id}', () => {
        it('Deve retornar sucesso 200 quando a transferência existir com um id válido', async() => {
            const resposta = await request(process.env.BASE_URL)
            .get('/transferencias/1')
            .set('Authorization', `Bearer ${token}`)

            console.log(resposta.status)
            console.log(resposta.body)
            expect(resposta.status).to.equal(200)
            expect(resposta.body.id).to.equal(1)
            expect(resposta.body.id).to.be.a('number')
            expect(resposta.body.valor).to.equal(200.50)
            expect(resposta.body.conta_origem).to.equal(1)
            expect(resposta.body.conta_destino).to.equal(2)

        })
    })
})