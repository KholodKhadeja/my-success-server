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
    catch(err){res.status(400).json({error:err});}
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
        const userData = await updateUserById(
            validatedValues.email, validatedValues.firstname,
            validatedValues.  lastname, validatedValues.password, validatedValues.role,
            validatedValues.studentclass, validatedValues.specialization,
            validatedValues.mylessons, validatedValues. favlessons, validatedValues. profileImg
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
    }catch(err){
        res.status(400).json({err});
    }
});

module.exports = router;