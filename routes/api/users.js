const express = require("express");
const router = express.Router();
const User= require("../../models/user.model");
const {Lesson}=require("../../models/lesson.model");

const { selectAllUsers,
    createNewUser, 
    updateUserLessonById,
    updateUserById,
    deleteUserById,
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
        console.log(err);
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
            res.status(400).json({err});
    }
});

router.post('/:userId/mylessons', async (req, res) => {
    const { userId } = req.params;

    const { subject, topic, learningLevel, hour, date } = req.body;
    const theUser = await getUserById(userId);
    try { 
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
      const lesson = new Lesson({ subject , topic , learningLevel ,hour, date, students: [],teacherId: theUser._id});
      await lesson.save();
      const updatedUser= await updateUserLessonById(userId,{ $push: { mylessons: lesson} },{ new: true } );
      console.log(updateUserById);
      res.status(201).json("lesson added to mylessons");
    } catch (err) {
      console.error(err);
      res.status(500).json(error);
    }
  });


router.patch("/", async (req, res)=>{
    try{
        const validatedValues = await validateUpdateUserSchema(req.body);
        const userData = await updateUserById(validatedValues.id,
            validatedValues.firstname,
            validatedValues.  lastname, 
            validatedValues.email, 
            validatedValues.password,
             validatedValues.role,
            validatedValues.studentclass, 
            validatedValues.specialization,
            validatedValues.mylessons,
             validatedValues. favlessons,
              validatedValues.profileImg,
              validatedValues.userstatus
            );
         res.json({msg:"updated successfully!!"});

    }catch(err){
        console.log(err);
       res.status(400).json({err});
    }
});

// router.patch("/addlesson/:id", async (req, res)=>{er
//     try{
//         const validatedValues = await validateUpdateUserSchema(req.body);
//         const userData = await updateUserById(validatedValues.id,
//             validatedValues.mylessons, );
//          res.json({msg:"updated successfully!!"});
//     }catch(err){
//         console.log(err);
//        res.status(400).json({err});
//     }
// });

router.delete("/:id", async (req, res)=>{
    try{
        const validatedValue = await validateDeleteUserSchema(req.params);
        const userData = await deleteUserById(validatedValue.id);
        res.json({msg:"deleted successfully!!"});
    }catch(err){
        res.status(400).json({err});
    }
});

module.exports = router;