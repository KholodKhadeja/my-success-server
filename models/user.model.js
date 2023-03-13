const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roleEnum = require("../enum/Role.Enum");

const UserSchema = new Schema({
    email:{type:String, required:true, unique: true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String,default: roleEnum[0], enum: [...roleEnum]},
    studentclass:{type:String},
    specialization:{type:String},
    mylessons: [{
        type: Schema.Types.ObjectId,
        ref: "lessons"
      }],
    profileImg: { type: String },
})

const User= mongoose.model("users", UserSchema);

const selectAllUsers = () =>{
    return User.find({});
};
const getUserById = (id)=>{
    return User.findById(id);
}

const createNewUser = (userData) => {
    const user = new User (userData);
    return user.save();
}

const updateUserById=(id,firstname,lastname,email,password,role,studentclass,specialization,mylessons,profileImg)=>{
        return User.findByIdAndUpdate(id,{
            firstname,
            lastname,
            email,
            password,
            role,
            studentclass,
            specialization,
            mylessons,
            profileImg
        })}

const deleteUserById = (id)=>{
    return User.findByIdAndDelete(id);}

module.exports={selectAllUsers,
    createNewUser, 
    updateUserById,
    deleteUserById,
    getUserById
    };