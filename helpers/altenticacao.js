const request = require('supertest');
const postLogin = require('../fixtures/postLogin.json');

const obterToken = async (usuario, senha) => {
    const bodyLogin = {...postLogin}
    const respostaLogin = await request(process.env.BASE_URL)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)
    
    const token = respostaLogin.body.token;
    return token;
}

module.exports = {
    obterToken
}