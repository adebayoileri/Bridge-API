import Joi from '@hapi/joi';


const validateReviewUser = obj => {
    const JoiSchema = Joi.object({
      review: Joi.string().min(3).max(200).required(),
      rating: Joi.number().integer().min(0).required(),
    }).options({
        abortEarly: false
    });
    
    return JoiSchema.validate(obj)
}
// admin: Joi.string().valid('true')
//   .valid('false').optional(),

export default validateReviewUser;
