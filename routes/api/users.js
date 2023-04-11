const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User= require("../../models/user.model");
const {Lesson, LessonSchema}=require("../../models/lesson.model");

const { addStudentToStudentArrayOfaLesson, getLessonById, deleteLessonById,addStuToStudentsArray } = require("../../models/lesson.model");
const { selectAllUsers,
  updateUserSpecificLessonByUserId,
    createNewUser, 
    updateUserLessonById,
    updateUserById,
    deleteUserById,
    updateUserFavLessonById,updateUserMyLessonById,
    getUserById} = require("../../models/user.model");
const {
    validateDeleteUserSchema, 
    validateNewUserSchema,
    validateUpdateUserSchema,
    validateFindUserByIdSchema
} = require("../../validation/users.validation");

{/*to show all the users that were created in the db*/}
router.get("/", async(req, res)=>{
    try{
        const data = await selectAllUsers();
        res.json(data); }
    catch(err){
        res.status(400).json({error:err});}
});

router.get("/getuserbyid/:id", async (req, res) => {
    try {
      const validatedValue = await validateFindUserByIdSchema(req.params);
      const userData = await getUserById(req.params.id);
      res.json(userData);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  });

router.post("/", async (req, res)=>{
    try{
       const validatedValue = await validateNewUserSchema(req.body);
       const newUser = await createNewUser(validatedValue);
       res.status(201).json({msg:"Added successfully!!"}); 
    }catch(err){
            console.log(err);
            res.status(400).json({err});
    }
});

/*מורה מוסיף שיעור*/
router.post('/:userId/mylessons', async (req, res) => {
    const { userId } = req.params;
    let lesson = req.body;
    try { 
      const theUser = await getUserById(userId);
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
     lesson = new Lesson({ subject:lesson.subject , 
        topic: lesson.topic,
         learningLevel:lesson.learningLevel ,
         hour:lesson.hour,
         date:lesson.date, 
         students: [],
         zoomLink:lesson.zoomLink,
         teacherId: {_id:userId}});
      lesson = await lesson.save();
      const updatedUser = await updateUserLessonById(userId, lesson);
      console.log(updateUserById);
      res.status(201).json("lesson added to mylessons");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

/*update user details*/
router.patch("/", async (req, res)=>{
    try{
        const validatedValues = await validateUpdateUserSchema(req.body);
        const userData = await updateUserById(req.body._id,req.body);
         res.json({msg:"update completed!"});
    }catch(err){
        console.log(err);
       res.status(400).json({err});
    }
});

/*אני לא בטוחה שמשתמשת בזה בכלל*/
// router.patch("/:userId/updatelesson/:lessonId", async (req, res)=>{
//   try{
//     const userId= req.params.userId;
//     const lessonId = req.params.lessonId;
//     const updatedData = req.body;
//     const updatedLesson = updateUserSpecificLessonByUserId(userId, lessonId, updatedData);
//     res.json({msg:"updated lesson successfully!!"});
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update lesson' });
//   }
// });

/*מחיקת משתמש*/
router.delete("/:id", async (req, res)=>{
    try{
        const validatedValue = await validateDeleteUserSchema(req.params);
        const userData = await deleteUserById(validatedValue.id);
        res.json({msg:"deleted successfully!!"});
    }catch(err){
        res.status(400).json({err});
    }
});

  /*שיעור מתווסף לרשימת מועדפים */
  router.post('/:studentId/favlessons/:lessonId', async (req, res) => {
    const { studentId,lessonId } = req.params;
    try { 
      const theUser = await getUserById(studentId);
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
      const updatedUser= await updateUserFavLessonById(studentId,{ $push: { favlessons:lessonId} } );
      res.status(201).json("lesson added to student fav successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
 /*removing lesson from myfav array for a student*/
router.delete('/:studentId/favlessons/:lessonId', async (req, res) => {
  const { studentId, lessonId } = req.params;
  try { 
    const theUser = await getUserById(studentId);
  if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser= await updateUserFavLessonById(studentId,{ $pull: { favlessons:lessonId} } );
    res.status(201).json("lesson removed from fav successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

  /*assign lesson to student*/ 
  /*הלומד רושם את עצמו לשיעור*/
  router.post('/:studentId/registertolesson/:lessonId', async (req, res) => {
    const { studentId, lessonId  } = req.params;
    try { 
      const theUser = await getUserById(studentId);
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser = await updateUserMyLessonById(studentId, lessonId);
    // const updateStudentArr = await addStuToStudentsArray(lessonId,studentId);
    await LessonSchema.findByIdAndUpdate(
      lessonId,
      { $push: { students: studentId } },
      { new: true }
    );
      res.status(201).json("lesson added to student successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
 /*cancel registration*/
router.delete('/:studentId/mylessons/:lessonId', async (req, res) => {
  const { studentId, lessonId } = req.params;
  const theUser = await getUserById(studentId);
  try { 
  if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser= await updateUserLessonById(studentId,{ $pull: { mylessons:lessonId} } );
    const updatedLesson = await addStudentToStudentArrayOfaLesson(lessonId,{ $pull: { students:studentId} } );
    res.status(201).json("lesson removed from mylessons successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;