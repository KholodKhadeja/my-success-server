const Joi = require("Joi");
const  validate = require("./validate");
const learningLevelEnum = require("../enum/LearningLevel.Enum");
const { User } = require("../models/user.model");

const newLessonSchema = Joi.object({
    subject:Joi.string().min(2).max(255).required().trim(),
    topic:Joi.string().min(2).max(255).required().trim(),
    learningLevel:Joi.string().valid(...learningLevelEnum).required(),
    teacherId:Joi.string().length(24).hex().required(),
    hour:Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    date:Joi.date().required().greater(Date.now() + 48 * 60 * 60 * 1000),
    students:Joi.array().items(Joi.object({User})),
});
const validateNewLessonSchema = (lessonInfo)=>{
    return validate(newLessonSchema, lessonInfo);
};

const updateLessonSchema = Joi.object({
    id: Joi.string().length(24).hex().required().trim(),
    subject:Joi.string().min(2).max(255).required().trim(),
    topic:Joi.string().min(2).max(255).required().trim(),
    learningLevel:Joi.string().valid(...learningLevelEnum).required(),
    teacherId:Joi.string().length(24).hex().required().trim(),
    hour:Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    date:Joi.date().required().greater(Date.now() + 48 * 60 * 60 * 1000),
    students:Joi.array().items(Joi.object({User})),
});
const validateUpdateLessonSchema = (lessonInfo)=>{
    return validate(updateLessonSchema, lessonInfo);
};

const deleteLessonSchema = Joi.object({
    id: Joi.string().length(24).hex().required().trim(),
  });
  const validateDeleteLessonSchema = (lessonInfo) => {
    return validate(deleteLessonSchema, lessonInfo);
  };

  const findLessonByIdSchema = Joi.object({
    id:Joi.string().length(24).hex().required().trim(),
    });
    const validateFindLessonByIdSchema = (lessonInfo)=>{
        return validate(findLessonByIdSchema, lessonInfo);
    }

  module.exports={
  validateDeleteLessonSchema, 
  validateNewLessonSchema,
  validateUpdateLessonSchema,
  validateFindLessonByIdSchema
  };
