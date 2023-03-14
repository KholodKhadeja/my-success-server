const Joi = require("Joi");
const  validate = require(".//validate");

// const registerSchema = Joi.object({
//     name: Joi.string().min(2).max(255).required().trim(),
//     email: Joi.string().min(8).max(255).email().required().trim(),
//     password: Joi.string()
//       .regex(
//         new RegExp(
//           "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$"
//         )
//       )
//       .required(),
//     avatar: Joi.string(),
//   });

// const validateRegisterSchema = (userInput) =>{
//     return validate(registerSchema, userInput);
// }

// const loginSchema = Joi.object({
//     email: Joi.string().min(8).max(255).email().required().trim(),
//     password: Joi.string()
//       .regex(
//         new RegExp(
//           "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$"
//         )
//       )
//       .required(),
// });
 
// const validateLoginSchema = (userInput) =>{
// return validate(loginSchema, userInput);
// }

// const forgetPasswordSchema = Joi.object({
//   email: Joi.string().min(8).max(255).email().required().trim(),
// });

// const validateForgetPasswordSchema = (userInput)=>{
//   return validate(forgetPasswordSchema, userInput);
// }

// module.exports={
//     validateRegisterSchema,
//     validateLoginSchema,
//     validateForgetPasswordSchema,
// };