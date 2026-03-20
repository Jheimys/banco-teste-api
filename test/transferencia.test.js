const request = require('supertest');
const { expect } = require('chai');

describe('Transferencias', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar sucesso 201 quando o valor da transferência for maior ou igual a 10.00', async() => {
            //Captura do token de autenticação
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    "username": 'julio.lima',
                    "senha": '123456'
                })

            const token = respostaLogin.body.token;

            const resposta = await request('http://localhost:3000')
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                contaOrigem: 1,
                contaDestino: 2,
                valor: 11,
                token: ""
            })

            expect(resposta.status).to.equal(201)
            console.log(resposta.body)
        })

        it('Deve retornar falha 422 quando o valor da transferência for menor que 10.00', async() => {
            //Captura do token de autenticação
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    "username": 'julio.lima',
                    "senha": '123456'
           })

            const token = respostaLogin.body.token;

            const resposta = await request('http://localhost:3000')
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                contaOrigem: 1,
                contaDestino: 2,
                valor: 8,
                token: ""
            })

            expect(resposta.status).to.equal(422)
            console.log(resposta.body)

        })
    })
})