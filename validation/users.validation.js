const joi = require("joi");
const  validate = require("./validate");
const roleEnum = require("../enum/Role.Enum");
const { Lesson } = require("../models/lesson.model");

const newUserSchema = joi.object({
    firstname: joi.string().min(2).max(255).required().trim(),
    lastname: joi.string().min(2).max(255).required().trim(),
    email:joi.string().email().required(),
    password: joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
    role: joi.string().valid(...roleEnum).required(),
    studentclass: joi.string().min(0).max(20).trim(),
    specialization:joi.string().min(0).max(20).trim(),
    mylessons: joi.array().items(Lesson),
    favlessons:joi.array().items(Lesson),
    profileImg: joi.string().uri(),
    userstatus: joi.boolean().required()
});
const validateNewUserSchema = (userInput)=>{
    return validate(newUserSchema, userInput);
};
const updateUserSchema = joi.object({
    id: joi.string().length(24).hex().required().trim(),
    firstname: joi.string().min(2).max(100).required().trim(),
    lastname: joi.string().min(2).max(100).required().trim(),
    email:joi.string().email().required().trim(),
    password: joi.string().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$")).required(),
    role: joi.string().valid(...roleEnum).required(),
    studentclass: joi.string().min(0).max(20).trim(),
    specialization:joi.string().min(0).max(20).trim(),
    mylessons: joi.array().items(Lesson),
    favlessons:joi.array().items(Lesson),
    profileImg: joi.string().uri(),
    userstatus: joi.boolean().required()
});
const validateUpdateUserSchema = (userInput)=>{
    return validate(updateUserSchema, userInput);
};
const deleteUserSchema = joi.object({
    id: joi.string().length(24).hex().required().trim(),
  });
  const validateDeleteUserSchema = (userInput) => {
    return validate(deleteUserSchema, userInput);
  };

  const findUserByIdSchema = joi.object({
    id:joi.string().length(24).hex().required().trim(),
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