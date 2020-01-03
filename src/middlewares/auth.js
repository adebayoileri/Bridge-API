import jwt from 'jsonwebtoken';

const secret = process.env.JWT_KEY;
 const checkAuth = (req, res, next) =>{
try {
    const decoded = req.headers.authorization.split(' ')[1]||req.body.token;
    const decoded = jwt.verify(token, secret);
    req.userData = decoded;
    next();
} catch (error) {
    return res.status(401).json({
        "message":"Not Authorized"
    })
}
 }

 export default checkAuth;