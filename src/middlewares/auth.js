import Joi from '@hapi/joi';

// checking if header is not undefined, if request is undefined return (403) bad request
const checkToken = (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1] || req.token;
      jwt.verify(token, process.env.JWT_KEY)
      req.token = token;

      next();
    } else {
      // if header is undefined , return bad request
      res.sendStatus(403).json({
        message: 'Not Authorized',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const validateUserSignup = user => {
  const JoiSchema = Joi.object({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(50).required(),
    phonenumber: Joi.string().min(10).max(15).required(),
    password: Joi.string().min(5).max(30).required(),
    admin: Joi.string().valid('TRUE')
      .valid('FALSE').optional(),
  }).options({
    abortEarly: false
  });

  return JoiSchema.validate(user)
}

const validateLogin = user => {
  const JoiSchema = Joi.object({
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(5).max(30).required(),
  }).options({
    abortEarly: false
  });

  return JoiSchema.validate(user)
}


export {
  checkToken,
  validateUserSignup,
  validateLogin
}