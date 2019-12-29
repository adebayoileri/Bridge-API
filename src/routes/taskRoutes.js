import express from 'express';

const router = express.Router();

router.get('/tasks',(req, res)=>{
    res.status(200).json({
        "message":"All task available"
    })
})


router.get('/tasks/:id',(req, res)=>{
    res.status(200).json({
        "message":"A single task available"
    })
})

router.post('/tasks/create',(req, res)=>{
    res.status(201).json({
        "message":"New task created"
    })
})

router.delete('/tasks/:id',(req, res)=>{
    res.status(200).json({
        "message":"Task with id deleted"
    })
})
export default router;