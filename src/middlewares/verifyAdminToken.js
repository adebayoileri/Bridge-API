import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';

// checking if header is not undefined, if request is undefined return (403) bad request
const checkAdminToken = (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        if (typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1] || req.token;
            const decodedToken = jwt.verify(token, process.env.ADMINKEY);
            req.admin = decodedToken;
            req.token = token;

            next();
        } else {
            // if header is undefined , return bad request
            res.sendStatus(403).json({
                message: 'Not Authorized',
            });
        }
    } catch (error) {
        return res.status(403).json({
            status: "bad request",
            message: "Not Authorized",
            code: 403,
            error
        })
    }
};

const validateEmail = email => {
    const JoiSchema = Joi.object({
        email: Joi.string().email().min(5).max(50).required(),
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(email)
}

export {
    checkAdminToken,
    validateEmail
};