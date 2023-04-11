const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {User} = require("../../models/user.model");

const {selectAllLessons,createNewLesson,updateLessonById,deleteLessonById,getLessonById,addStuToStudentsArray} = require("../../models/lesson.model");
const { validateDeleteLessonSchema,validateNewLessonSchema,
  validateUpdateLessonSchema,
  validateFindLessonByIdSchema,
} = require("../../validation/lessons.validation");
const {deleteLessonFromMyLesson} = require("../../models/user.model");

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

router.patch("/", async (req, res) => {
    try{
        const validatedValues = await validateUpdateLessonSchema(req.body);
        const lessonId = await getLessonById(validatedValues.id);
        if (!lessonId) throw "lesson not exists";
          await updateLessonById(validatedValues.id,
            validatedValues.subject,validatedValues.topic,
            validatedValues.learningLevel,
            validatedValues.hour,
            validatedValues.date,
            validatedValues.students,
            validatedValues.zoomLink
            );
        res.status(201).json({ msg: "put proccessed" });
      } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
      }
});

/*מחיקת שיעור באופן סופי מהמערכת וגם אצל המורה */
router.delete("/:id/:userid", async (req, res) => {
  const lessonId = req.params.id;
  const userId= req.params.userid;
    try{
        const lessonData = await deleteLessonById(lessonId, userId);
        const deletedLessonForUser = await deleteLessonFromMyLesson( userId,{ $pull: {mylessons:lessonId} });
        res.json({msg:"Lesson deleted successfully!!"});
    }catch(err){
      console.log(err);
        res.status(400).json({err});
    }
});

/*בעת הרשמת התלמיד שיופעל רואטר שני*/
router.post('/:studentId/registertolesson/:lessonId', async (req, res) => {
  const { studentId, lessonId  } = req.params;
  try { 
    const theUser = await getUserById(studentId);
  if (!theUser) {return res.status(404).json({ error: 'User not found' });}
  const updateStudentArr = await addStuToStudentsArray(lessonId,studentId);
    res.status(201).json("lesson added to student successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
