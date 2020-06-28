// import jwt from 'jsonwebtoken';

// const secret = process.env.JWT_KEY;
//  const checkAuth = (req, res, next) =>{
// try {
//     const decoded = req.headers.authorization.split(' ')[1]||req.body.token;
//     const decoded = jwt.verify(token, secret);
//     req.userData = decoded;
//     next();
// } catch (error) {
//     return res.status(401).json({
//         "message":"Not Authorized"
//     })
// }
//  }

//  export default checkAuth;

// checking if header is not undefined, if request is undefined return (403) bad request
const checkToken = (req, res, next) =>{
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined'){
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;

        next();
    }else{
        // if header is undefined , return bad request
        res.sendStatus(403)
    }
}

export default checkToken;