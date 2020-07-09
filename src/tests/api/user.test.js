import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import {server} from '../../server';

dotenv.config();
chai.use(chaiHttp);
chai.should();

 describe('TEST user controller', ()=> {
   
        it('GET get user profile', (done) => {
            chai.request(server)
            .get('/api/v1/user')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('PUT update profile', (done) => {
            let updateProfile = {
                first_name: 'Name updated',
               }
            chai.request(server)
            .put('/api/v1/user/edit')
            .send(updateProfile)
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })
})
