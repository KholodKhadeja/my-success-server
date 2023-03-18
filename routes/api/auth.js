/*this file includes login/register/logout */
const express = require("express");
const router = express.Router();

const { createNewUser, getUserById, getUserByEmail, updatePasswordById} = require("../../models/user.model");
const { validateRegisterSchema, validateLoginSchema} = require("../../validation/auth.validation");
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
         const user = await getUserByEmail(validatedData.email);/*this variables hold the user that this email matches him */
         if(!user){
            throw "invalid email";
         }
    const isEqualPasswords = await cmpHash(validatedData.password, user.password);
    if(!isEqualPasswords){
        throw "invalid password";
    }
    const token = await getToken({ /*this data are passed in the payload*/
        email:user.email,
        id:user._id,
        role: user.role,
    });
    res.status(201). json({msg:"login successfully!!!!!"});
    console.log({token});/*the token that was created in the loggin proccess*/
    }catch(err){
        res.status(400).json({ err});
      }
});

// router.post("/forgotpassword", async (req, res)=>{
//     try{
//     const validatedValue =await validateForgetPasswordSchema(req.body);
//     const userData = await getUserByEmail(validatedValue.email);
//     if(!userData) throw "check your inbox";
//     const jwt = getToken({email: userData.email},"1h"); /*expires in 1 hour*/
//     console.log("http://localhost:3000/resetpassword/" + jwt);
//     res.json({msg:"check your inbox"});}
//     catch(err){
//         res.json({msg:err});
//     }
// });

// router.post("/resetpassword/:id", async(req, res) =>{
//     try{
//         const payload = await verifyToken(req.params.token);
//         const userData = await getUserByEmail(payload.email);
//         if(!userData) throw "something went wrong";
//         await   updatePasswordById(userData._id, hashedPassword);
//         res.json({msg:"password updated"});
//     }catch(err){
//         res.status(400).json({ err });
//     }
// });

module.exports = router;
