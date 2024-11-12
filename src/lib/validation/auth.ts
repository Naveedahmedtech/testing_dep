import Joi from "joi";



export const registerSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().required(),
  role: Joi.string().required()
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});
