import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';

import {server} from '../../server';

dotenv.config();
chai.use(chaiHttp);
chai.should();

describe('POST /signup', ()=> {
    it('it should signup users', ()=>{
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            email: "test@mail.com",
            first_name: "adams",
            last_name: "Moll",
            phonenumber: "+23412321212",
            admin: 'FALSE',
            password: '12345'
        })
        .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
        })
    })
})

describe('POST /signup', ()=> {
    it('it should throw an error for empty fields', ()=>{
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            first_name: "adams",
            last_name: "Moll"
        })
        .end((err, res)=>{
            res.should.have.status(400);
        })
    })
})

// test for signing in users
describe('POST /login', ()=> {
    it('it should login users', ()=>{
        chai.request(server)
        .post('/api/v1/auth/login')
        .send({
            email: "test@mail.com",
            password: '12345'
        })
        .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.contains.message('signed in successfully');
        })
    })
})
