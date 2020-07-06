import Joi from '@hapi/joi';

const idValidator = id => {
    const JoiSchema = Joi.object({
        id: Joi.number().integer().min(0).required(),
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(id)
}

export default idValidator;