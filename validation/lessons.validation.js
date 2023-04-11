const joi = require("joi");
const  validate = require("./validate");
const learningLevelEnum = require("../enum/LearningLevel.Enum");
const { User } = require("../models/user.model");

const newLessonSchema = joi.object({
    subject:joi.string().min(2).max(255).required().trim(),
    topic:joi.string().min(2).max(255).required().trim(),
    learningLevel:joi.string().valid(...learningLevelEnum).required(),
    hour:joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    date:joi.date().required().greater(Date.now() + 48 * 60 * 60 * 1000),
});
const validateNewLessonSchema = (lessonInfo)=>{
    return validate(newLessonSchema, lessonInfo);
};

const updateLessonSchema = joi.object({
    id: joi.string().length(24).hex().required().trim(),
    subject:joi.string().min(2).max(255).required().trim(),
    topic:joi.string().min(2).max(255).required().trim(),
    learningLevel:joi.string().valid(...learningLevelEnum).required(),
    hour:joi.string().required(),
    date:joi.date().required().greater(Date.now() + 48 * 60 * 60 * 1000),
});

const validateUpdateLessonSchema = (lessonInfo)=>{
    return validate(updateLessonSchema, lessonInfo);
};

const deleteLessonSchema = joi.object({
    id: joi.string().length(24).hex().required().trim(),
  });
  const validateDeleteLessonSchema = (lessonInfo) => {
    return validate(deleteLessonSchema, lessonInfo);
  };

  const findLessonByIdSchema = joi.object({
    id:joi.string().length(24).hex().required().trim(),
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
