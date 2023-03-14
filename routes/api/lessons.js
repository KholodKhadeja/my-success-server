const express = require("express");
const router = express.Router();
const {
  selectAllLessons,
  createNewLesson,
  updateLessonById,
  deleteLessonById,
  getLessonById,
} = require("../../models/lesson.model");
const {
  validateDeleteLessonSchema,
  validateNewLessonSchema,
  validateUpdateLessonSchema,
  validateFindLessonByIdSchema,
} = require("../../validation/lessons.validation");

router.get("/", async (req, res) => {
  try {
    const allLessons = await selectAllLessons();
    res.json(allLessons);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/getbyid/:id", async (req, res) => {
  try {
    const validatedValue = await validateFindLessonByIdSchema(req.params);
    const lessonData = await showLessonById(validatedValue.id);
    res.json(lessonData);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedValue = await validateNewLessonSchema(req.body);
    console.log(req);
    const lessonData = await createNewLesson(validatedValue);
  
    res.status(201).json({ msg: "added successfully!!" });
  } catch (err) {
    console.log(req.body);
    res.status(400).json({ err });
  }
});

router.patch("/", async (req, res) => {
  try {
    const validatedValue = await validateUpdateLessonSchema(req.body);
    const lessonId = await getLessonById(validatedValue.id);
    if (!lessonId) throw "lesson not exists";
    if (
      lessonId.teacherId === req.lessonData.id ||
      req.lessonData.allowAccess
    ) {
      await updateLessonById(
        validatedValue.subject,
        validatedValue.topic,
        validatedValue.learningLevel,
        validatedValue.teacherId,
        validatedValue.hour,
        validatedValue.date,
        validatedValue.students
      );
    } else {
      throw "operation invalid aka unauthorized";
    }
    res.status(201).json({ msg: "put proccessed" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const validateValue = await validateDeleteLessonSchema(req.params);
    const lessonData = await deleteLessonById(validateValue.id);
    if (!lessonData) throw "lesson not existed!";
    if (
      lessonData.teacherId == req.lessonData.id ||
      req.lessonData.allowAccess
    ) {
      const lessonDeleteData = await deleteLessonById(validateValue.id);
      res.json(lessonDeleteData);
    } else {
      throw "operation invalid aka unauthorized";
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
