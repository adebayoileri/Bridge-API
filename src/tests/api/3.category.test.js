import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import {server} from '../../server';

dotenv.config();
chai.use(chaiHttp);
chai.should();

 describe('TEST Category controllers', ()=> {

    it('POST create category', (done) => {
       let newCategory = {
         name: 'testing',
         slug: 'test'
       }
        chai.request(server)
        .post('/api/v1/category/create')
        .send(newCategory)
        .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
        })
        done();
    })
   
        it('GET get all categories', (done) => {
            chai.request(server)
            .get('/api/v1/category')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('GET get a category', (done) => {
            chai.request(server)
            .get('/api/v1/category/1')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })


        it('PUT update a category', (done) => {
            let updateCategory = {
                name: 'update',
                slug: 'test'
              }
            chai.request(server)
            .put('/api/v1/category/update/1')
            .send(updateCategory)
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })
    

        it('DELETE deleting a category', (done) => {
            chai.request(server)
            .delete('/api/v1/category/1')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })
})
