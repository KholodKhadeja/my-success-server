const joi = require("joi");
const  validate = require("./validate");
const roleEnum = require("../enum/Role.Enum");
const {Lesson } = require("../models/lesson.model");


const registerSchema = joi.object({
    firstname: joi.string().min(2).max(100).required().trim(),
    lastname: joi.string().min(2).max(100).required().trim(),
    email:joi.string().email().required(),
    password: joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
    role: joi.string().valid(...roleEnum).required(),
    studentclass: joi.string().min(2).max(20).trim(),
    specialization:joi.string().min(2).max(20).trim(),
    mylessons: joi.array().items(Lesson),
    favlessons:joi.array().items(Lesson),
    profileImg: joi.string().uri(),
    userstatus: joi.boolean().required()
  });

const validateRegisterSchema = (userInput) =>{
    return validate(registerSchema, userInput);
}

const loginSchema = joi.object({
    email:joi.string().email().required().trim(),
    password: joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
});
 
const validateLoginSchema = (userInput) =>{
return validate(loginSchema, userInput);
}

const forgetPasswordSchema = joi.object({
  email: joi.string().min(8).max(255).email().required().trim(),
});

const validateForgetPasswordSchema = (userInput)=>{
  return validate(forgetPasswordSchema, userInput);
}

module.exports={
    validateRegisterSchema,
    validateLoginSchema,
    validateForgetPasswordSchema,
};