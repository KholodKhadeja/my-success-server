const Joi = require("Joi");
const  validate = require("./validate");
const roleEnum = require("../enum/Role.Enum");
const {Lesson } = require("../models/lesson.model");


const registerSchema = Joi.object({
    firstname: Joi.string().min(2).max(100).required().trim(),
    lastname: Joi.string().min(2).max(100).required().trim(),
    email:Joi.string().email().required(),
    password: Joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
    role: Joi.string().valid(...roleEnum).required(),
    studentclass: Joi.string().min(2).max(20).trim(),
    specialization:Joi.string().min(2).max(20).trim(),
    mylessons: Joi.array().items(Lesson),
    favlessons:Joi.array().items(Lesson),
    profileImg: Joi.string().uri(),
    userstatus: Joi.boolean().required()
  });

const validateRegisterSchema = (userInput) =>{
    return validate(registerSchema, userInput);
}

const loginSchema = Joi.object({
    email:Joi.string().email().required().trim(),
    password: Joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
});
 
const validateLoginSchema = (userInput) =>{
return validate(loginSchema, userInput);
}

const forgetPasswordSchema = Joi.object({
  email: Joi.string().min(8).max(255).email().required().trim(),
});

const validateForgetPasswordSchema = (userInput)=>{
  return validate(forgetPasswordSchema, userInput);
}

module.exports={
    validateRegisterSchema,
    validateLoginSchema,
    validateForgetPasswordSchema,
};