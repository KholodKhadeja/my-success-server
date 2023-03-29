const express = require("express");
const router = express.Router();

const { selectAllUsers,
    createNewUser, 
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
      const userData = await getUserById(validatedValue.id);
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
            res.status(400).json({err});
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