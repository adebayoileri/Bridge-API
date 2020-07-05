import Joi from '@hapi/joi';


const validateCategory = category => {
    const JoiSchema = Joi.object({
        slug: Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(category);
}


const filterTask = task => {
    const JoiSchema = Joi.object({
        status: Joi.string().min(3),
        category: Joi.string().min(3)
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(task)
}

export {
    validateCategory,
    filterTask
}