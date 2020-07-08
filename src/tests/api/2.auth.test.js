import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';

import {server} from '../../server';

dotenv.config();
chai.use(chaiHttp);
chai.should();

// test for signing in users
describe('Authentication controller', ()=> {

  it('[POST /signup] -> it should signup users', (done)=>{
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            email: "user@mail.com",
            first_name: "adams",
            last_name: "Moll",
            phonenumber: "+23412321212",
            password: '12345'
        })
        .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
        })
        done();
    })

   it('[POST  /login] -> it should login as a user', (done)=>{
        chai.request(server)
        .post('/api/v1/auth/login')
        .send({
            email: "user@mail.com",
            password: '12345'
        })
        .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.contains.message('signed in successfully');
        })
        done();
    })



    it('[POST /signup] -> signup as admin', (done)=>{
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            email: "admin@mail.com",
            first_name: "adams",
            last_name: "Moll",
            phonenumber: "+23412321212",
            adminSignature: process.env.ADMIN_SIGNATURE,
            password: '12345'
        })
        .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
        })
        done();
    })

    it('[POST  /login] -> it should login as an admin', (done)=>{
        chai.request(server)
        .post('/api/v1/auth/login')
        .send({
            email: "admin@mail.com",
            password: '12345'
        })
        .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.contains.message('admin login successful');
        })
        done();
    })
    
    it('[POST /signup] -> it should throw an error for empty fields', (done)=>{
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            first_name: "adams",
            last_name: "Moll"
        })
        .end((err, res)=>{
            res.should.have.status(400);
        })
        done();
    })


})