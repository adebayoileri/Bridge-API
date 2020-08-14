import Joi from '@hapi/joi';


const validateCreateNewTask = task => {
    const JoiSchema = Joi.object({
        title: Joi.string().min(3).required(),
        bannerImg: Joi.string().min(3).optional(),
        category: Joi.string().min(3).required(),
        jobtype: Joi.string().min(3).required(),
        pricetype: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        user_id: Joi.string().min(1).required(),
        // category_id: Joi.number().integer().min(1).required(),
        location: Joi.string().min(1).required(),
        fixedprice: Joi.string().min(1).optional(),
        minbudget: Joi.string().min(1).optional(),
        maxbudget: Joi.string().min(1).optional(),
        startdate: Joi.string().min(1).required(),
        enddate: Joi.string().min(1).required(),
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(task)
}

const validateUpdateTask = task => {
    const JoiSchema = Joi.object({
        title: Joi.string().min(3),
        bannerImg: Joi.string().min(3),
        category: Joi.string().min(3),
        description: Joi.string().min(5),
        user_id: Joi.string().min(1),
        location: Joi.string().min(1),
        category_id: Joi.number().integer().min(1),
        minbudget: Joi.string().min(1),
        maxbudget: Joi.string().min(1),
        startdate: Joi.string().min(1),
        enddate: Joi.string().min(1),
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(task)
}

const filterTask = task => {
    const JoiSchema = Joi.object({
        status: Joi.string().min(1),
        category: Joi.string().min(1),
        location: Joi.string().min(1).max(150).required()
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(task)
}

const searchTask = task => {
    const JoiSchema = Joi.object({
        keyword: Joi.string().min(1).max(150).required()
    }).options({
        abortEarly: false
    });

    return JoiSchema.validate(task)
}

export {
    validateCreateNewTask,
    validateUpdateTask,
    searchTask,
    filterTask
}