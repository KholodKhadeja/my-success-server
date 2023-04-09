const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {User} = require("../../models/user.model");

const {selectAllLessons,createNewLesson,updateLessonById,deleteLessonById,getLessonById,updateUserSpecificLessonByUserId} = require("../../models/lesson.model");
const { validateDeleteLessonSchema,validateNewLessonSchema,
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
    const lessonData = await getLessonById(req.params.id);
    res.json(lessonData);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
});

router.post("/", authMiddleware ,async (req, res) => {
  try {
    const validatedValue = await validateNewLessonSchema(req.body);
    const lessonData = await createNewLesson(
      validatedValue.subject,
      validatedValue.topic,
      validatedValue.learningLevel,
      validatedValue.hour,
      validatedValue.date,
      validatedValue.students,
      validatedValue.zoomLink,
      req.userData.id);
    res.status(201).json({ msg: "Lesson added successfully!!" });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.patch("/", authMiddleware ,async (req, res) => {
    try{
        const validatedValues = await validateUpdateLessonSchema(req.body);
        const lessonId = await getLessonById(validatedValues.id);
        if (!lessonId) throw "lesson not exists";
        if (lessonId.teacherId.valueOf() === req.userData.id || req.userData.allowAccess) {
          await updateLessonById(validatedValues.id,
            validatedValues.subject,validatedValues.topic,
            validatedValues.learningLevel,
            validatedValues.hour,
            validatedValues.date,
            validatedValues.students,
            validatedValue.zoomLink,);
        } else {
          throw "operation invalid aka unauthorized";
        }
        res.status(201).json({ msg: "put proccessed" });
      } catch (err) {
        res.status(400).json({ error: err });
      }
});

// router.patch("/:userId/lessons/:lessonId", authMiddleware ,async (req, res) => {
//   try{
//     const userId = req.params.userId;
//     const lessonId= req.params.lessonId;
//     const updateContent = req.body;
//     const updatedLesson = await updateUserSpecificLessonByUserId(userId, lessonId, updateContent);
//     // if (!lessonId) throw "lesson not exists";
//     // if (lessonId.teacherId.valueOf() === req.userData.id || req.userData.allowAccess) {
//     //   await updateLessonById(validatedValues.id,
//     //     validatedValues.subject,validatedValues.topic,
//     //     validatedValues.learningLevel,
//     //     validatedValues.hour,
//     //     validatedValues.date,
//     //     validatedValues.students);
//     res.status(201).json({ msg: "put proccessed" });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ error: err });
//   }
//   });

router.delete("/:id", authMiddleware ,async (req, res) => {
    try{
        const validatedValue = await validateDeleteLessonSchema(req.params);
        const lessonData = await deleteLessonById(validatedValue.id);
        res.json({msg:"Lesson deleted successfully!!"});
    }catch(err){
        res.status(400).json({err});
    }

//   try {
//     const validateValue = await validateDeleteLessonSchema(req.params);
//     const lessonData = await deleteLessonById(validateValue.id);
//     if (!lessonData) throw "lesson not existed!";
//     if (
//       lessonData.teacherId == req.lessonData.id || req.lessonData.allowAccess
//     ) {
//       const lessonDeleteData = await deleteLessonById(validateValue.id);
//       res.json(lessonDeleteData);
//       throw "item deleted"
//     } else {
//       throw "operation invalid aka unauthorized";
//     }
//   } catch (err) {
//     res.status(400).json({ error: err });
//   }
});

module.exports = router;
