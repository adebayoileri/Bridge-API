import {Router} from 'express';

const router = Router();

router.post('/signup',(req, res)=>{
    res.status(201).json({
        "message":"Signup successful",
    })
});

export default router;