import Joi from '@hapi/joi';


const validateEditProfile = profile => {
    const JoiSchema = Joi.object({
      first_name: Joi.string().min(3).max(30).required(),
      last_name: Joi.string().min(3).max(30).required(),
      phonenumber: Joi.string().min(10).max(15).required()
    }).options({
      abortEarly: false
    });

    return JoiSchema.validate(profile)
}

const setGenderValidation = user => {
    const JoiSchema = Joi.object({
      GenderName: Joi.string().valid('Male')
        .valid('Female').required(),
    }).options({
      abortEarly: false
    });
  
    return JoiSchema.validate(user)
  }

export {
    validateEditProfile,
    setGenderValidation
}