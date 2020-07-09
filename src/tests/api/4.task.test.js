import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import {server} from '../../server';

dotenv.config();
chai.use(chaiHttp);
chai.should();

 describe('TEST task controllers', ()=> {

    it('POST create new task', (done) => {
       let newTask = {
        title: 'buy stuffs',
        bannerImg: 'https://cdn.sample.png',
        category: 'category sample',
        description: 'I will like to buy food stuff',
        user_id : 1,
        category_id: 1,
        location : 'online',
        minbudget: '2000',
        maxbudget: '5000',
        startdate: '12|20|2020',
        enddate: '13|20|2020'
       }
        chai.request(server)
        .post('/api/v1/tasks/create')
        .send(newTask)
        .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.contains.message('task successfully created');
        })
        done();
    })
   
        it('GET get all tasks', (done) => {
            chai.request(server)
            .get('/api/v1/tasks')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.contains.message('get all tasks sucessfully');
            })
            done();
        })

        it('GET get a task', (done) => {
            chai.request(server)
            .get('/api/v1/tasks/1')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })


        it('PUT update a task', (done) => {
            let updateTask = {
                title: 'buy stuffs (updated)',
                bannerImg: 'https://cdn.sample.png',
                category: 'category sample (update)',
                description: 'I will like to buy food stuff',
                user_id : 1,
                category_id: 1,
                location : 'online',
                minbudget: '2000',
                maxbudget: '5000',
                startdate: '12|20|2020',
                enddate: '13|20|2020'
               }
            chai.request(server)
            .put('/api/v1/tasks/update/1')
            .send(updateTask)
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })
    

        it('DELETE deleting a task', (done) => {
            chai.request(server)
            .delete('/api/v1/tasks/1')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            })
            done();
        })

        it('GET get all filtered tasks', (done) => {
            chai.request(server)
            .get('/api/v1/tasks/filter?status=pending&category=one-time')
            .set('Authorization', `bearer ${process.env.USER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
             })
            done();
        })
})
