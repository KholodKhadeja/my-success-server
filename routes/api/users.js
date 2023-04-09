const express = require("express");
const router = express.Router();
const User= require("../../models/user.model");
const {Lesson}=require("../../models/lesson.model");

const { addStudentToStudentArrayOfaLesson, getLessonById, deleteLessonById } = require("../../models/lesson.model");
const { selectAllUsers,
  updateUserSpecificLessonByUserId,
    createNewUser, 
    updateUserLessonById,
    updateUserById,
    deleteUserById,
    updateUserFavLessonById,
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
      const lessonData = await getUserById(validatedValue.id);
      res.json(lessonData);
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

router.post('/:userId/mylessons', async (req, res) => {
    const { userId } = req.params;
    let lesson = req.body;
    const theUser = await getUserById(userId);
    try { 
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
     lesson = new Lesson({ subject:lesson.subject , 
        topic: lesson.topic,
         learningLevel:lesson.learningLevel ,
         hour:lesson.hour,
         date:lesson.date, 
         students: [],
         teacherId: {_id:userId}});
      lesson = await lesson.save();
      const updatedUser= await updateUserLessonById(userId,{ $push: { mylessons: lesson} } );
      res.status(201).json("lesson added to mylessons");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  /*assign lesson to student*/
  
  router.post('/:studentId/mylessons/:lessonId', async (req, res) => {
    const { studentId } = req.params;
    const { lessonId } = req.params;
    const theUser = await getUserById(studentId);
    const theLesson = await getLessonById(lessonId);
    try { 
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    /*in the array of a student*/
      const updatedUser= await updateUserLessonById(studentId,{ $push: { mylessons:lessonId} } );
      const updatedLesson = await addStudentToStudentArrayOfaLesson(lessonId,{ $push: { students:studentId} } );
      res.status(201).json("lesson added to student successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post('/:studentId/favlessons/:lessonId', async (req, res) => {
    const { studentId } = req.params;
    const { lessonId } = req.params;
    const theUser = await getUserById(studentId);
    try { 
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
      const updatedUser= await updateUserLessonById(studentId,{ $push: { favlessons:lessonId} } );
      res.status(201).json("lesson added to student fav successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.patch("/", async (req, res)=>{
    try{

        // const validatedValues = await validateUpdateUserSchema(req.body);
        const userData = await updateUserById(req.body.id,
          req.body
            );
            console.log(req.body);
         res.json({msg:"updated successfully!!"});
    }catch(err){
        console.log(err);
       res.status(400).json({err});
    }
});


router.patch("/:userId/lessons/:lessonId", async (req, res)=>{
  try{
    console.log(req.params);
    const userId= req.params.userId;
    const lessonId = req.params.lessonId;
    const updatedData = req.body;
    console.log("updated", updatedData);
    const updatedLesson = updateUserSpecificLessonByUserId(userId, lessonId, updatedData);
    res.json({msg:"updated lesson successfully!!"});
    console.log(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lesson' });
  }
});




router.delete("/:id", async (req, res)=>{
    try{
        const validatedValue = await validateDeleteUserSchema(req.params);
        const userData = await deleteUserById(validatedValue.id);
        res.json({msg:"deleted successfully!!"});
    }catch(err){
        res.status(400).json({err});
    }
});

/*deleting the lesson premenantly for the user and from the lessons array itself*/
router.patch('/:userId/mylessons/:lessonId', async (req, res) => {
  const { userId, lessonId } = req.params;
  try { 
    const theUser = await getUserById(userId);
  if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser= await updateUserLessonById(userId,{ $pull: { mylessons: lessonId} } );
    // const deletedLesson = await deleteLessonById(lessonId);
    console.log(theUser);
    theUser.mylessons=theUser.mylessons.filter(el => { 
      console.log( el._id != lessonId);
      return el._id != lessonId});
    console.log("after", theUser);
    await theUser.save();
    res.status(201).json("lesson removed to mylessons");
  } catch (err) {
    res.status(500).json(err);
  }
});


 /*removing lesson from myfav array for a student*/
router.delete('/:studentId/favlessons/:lessonId', async (req, res) => {
  const { studentId, lessonId } = req.params;
  const theUser = await getUserById(studentId);
  const theLesson = await getLessonById(lessonId);
  try { 
  if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser= await updateUserLessonById(studentId,{ $pull: { favlessons:lessonId} } );
   const updatedLesson = await addStudentToStudentArrayOfaLesson(lessonId,{ $pull: { students:studentId} } );
    res.status(201).json("lesson removed from fav successfully");
  } catch (err) {
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
    res.status(201).json("lesson removed from fav successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;