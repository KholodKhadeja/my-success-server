/*this file includes login/register/logout */
const express = require("express");
const router = express.Router();

const { createNewUser, getUserById, getUserByEmail, updatePasswordById} = require("../../models/user.model");
const { validateRegisterSchema, validateLoginSchema, validateForgetPasswordSchema} = require("../../validation/auth.validation");
const {createHash, cmpHash} = require("../../config/bcrypt");
const {getToken, verifyToken} = require("../../config/jwt");
const validate = require('../../validation/validate');
const { updateLessonById } = require('../../models/lesson.model');

router.post("/register", async(req, res)=>{
    try{
        const validatedValue = await validateRegisterSchema(req.body);
        const user =  getUserById(validatedValue.email);
        if(user){
           console.log("try another email") ;
        }
     const hashedPassword =  await createHash(validatedValue.password);
     validatedValue.password = hashedPassword;
     await createNewUser(validatedValue);
     res.status(201). json({msg:"user created"});
    }catch(err){
        res.status(400).json({err});
    }
});


router.post("/login", async(req, res)=>{
    try{
         const validatedData = await validateLoginSchema(req.body);
         const user = await getUserByEmail(validatedData.email);
         if(!user){
            throw "invalid email";
         }
    const isEqualPasswords = await cmpHash(validatedData.password, user.password);
    if(!isEqualPasswords){
        throw "invalid password";
    }
    const token = await getToken({
        email:user.email,
        id:user._id,
        role: user.role,
    });
    res.status(201). json({msg:"login successfully!!!!!", token});

    }catch(err){
        res.status(400).json({err});
      }
});


module.exports = router;
