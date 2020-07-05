import Joi from '@hapi/joi';

const queryValidator = query => {
    const JoiSchema = Joi.object({
        start: Joi.number().integer().min(0).required(),
        count: Joi.number().integer().min(5).max(30).required(),
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(query)
}

export default queryValidator;