const Joi = require("Joi");
const  validate = require("./validate");
const roleEnum = require("../enum/Role.Enum");
const { Lesson } = require("../models/lesson.model");

const newUserSchema = Joi.object({
    firstname: Joi.string().min(2).max(255).required().trim(),
    lastname: Joi.string().min(2).max(255).required().trim(),
    email:Joi.string().email().required(),
    password: Joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
    role: Joi.string().valid(...roleEnum).required(),
    studentclass: Joi.string().min(2).max(20).trim(),
    specialization:Joi.string().min(2).max(20).trim(),
    mylessons: Joi.array().items(Lesson),
    favlessons:Joi.array().items(Lesson),
    profileImg: Joi.string().uri(),
});
const validateNewUserSchema = (userInput)=>{
    return validate(newUserSchema, userInput);
};
const updateUserSchema = Joi.object({
    id: Joi.string().length(24).hex().required().trim(),
    firstname: Joi.string().min(2).max(255).required().trim(),
    lastname: Joi.string().min(2).max(255).required().trim(),
    email:Joi.string().email().required(),
    password: Joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
    role: Joi.string().valid(...roleEnum).required(),
    studentclass: Joi.string().min(2).max(20).trim(),
    specialization:Joi.string().min(2).max(20).trim(),
    mylessons: Joi.array().items(Lesson),
    favlessons:Joi.array().items(Lesson),
    profileImg: Joi.string().uri(),
});
const validateUpdateUserSchema = (userInput)=>{
    return validate(updateUserSchema, userInput);
};
const deleteUserSchema = Joi.object({
    id: Joi.string().length(24).hex().required().trim(),
  });
  const validateDeleteUserSchema = (userInput) => {
    return validate(deleteUserSchema, userInput);
  };

  const findUserByIdSchema = Joi.object({
    id:Joi.string().length(24).hex().required().trim(),
    });
    const validateFindUserByIdSchema = (lessonInfo)=>{
        return validate(findUserByIdSchema, lessonInfo);
    }

  module.exports={
    validateDeleteUserSchema, 
    validateNewUserSchema,
    validateUpdateUserSchema,
    validateFindUserByIdSchema
  }