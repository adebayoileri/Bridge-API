import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';

import { server } from '../../server';

dotenv.config();
chai.use(chaiHttp);
chai.should();

describe('Testing server',()=>{
    it('should respond with a status 200',()=>{
        chai.request(server).get('/').end((req, res)=>{
            res.should.have.status(200);
        });
    })
})