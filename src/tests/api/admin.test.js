import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import {server} from '../../server';

dotenv.config();
chai.use(chaiHttp);
chai.should();

 describe('TEST admin controllers', ()=> {

        it('GET get current admin profile', (done) => {
            chai.request(server)
            .get('/api/v1/admin/me')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
             })
            done();
        })

        it('GET get all users count', (done) => {
            chai.request(server)
            .get('/api/v1/admin/users/count')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('GET get all tasks count', (done) => {
            chai.request(server)
            .get('/api/v1/admin/tasks/count')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })


        it('DELETE delete a single task', (done) => {
            chai.request(server)
            .delete('/api/v1/admin/tasks/1')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('PUT suspend a user', (done) => {
            chai.request(server)
            .put('/api/v1/admin/suspenduser/1')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('PUT unsuspend a user', (done) => {
            chai.request(server)
            .put('/api/v1/admin/unsuspenduser/1')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('GET get a user', (done) => {
            chai.request(server)
            .get('/api/v1/admin/getuser/1')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('GET get all user', (done) => {
            chai.request(server)
            .get('/api/v1/admin/allusers')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('GET get all admin', (done) => {
            chai.request(server)
            .get('/api/v1/admin/all')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        
        it('GET get all tasks', (done) => {
            chai.request(server)
            .get('/api/v1/admin/tasks')
            .set('Authorization', `bearer ${process.env.ADMIN_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })
})
