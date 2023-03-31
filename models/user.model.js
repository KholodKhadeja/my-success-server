const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roleEnum = require("../enum/Role.Enum");

const userSchema = new Schema({
    email:{type:String, required:true, unique: true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String,default: roleEnum[0], enum: [...roleEnum]},
    studentclass:{type:String},
    specialization:{type:String},
    mylessons: [{type: Schema.Types.ObjectId,ref: "lessons"}],
      favlessons: [{
        type: Schema.Types.ObjectId,
        ref: "lessons" }],
    profileImg: { type: String },
    userstatus:{type: Boolean, default: true,required:true}
})

const User= mongoose.model("users", userSchema);

const selectAllUsers = () =>{
    return User.find({});
};

const getUserById = (id)=>{
    return User.findById({id});
}

const getUserByEmail = (email)=>{
    return User.findOne({email}).exec();
}

const createNewUser = (userData) => {
    const user = new User (userData);
    return user.save();
}

const updateUserById=(id,firstname,lastname,email,password,role,studentclass,specialization,mylessons,favlessons,profileImg,userstatus)=>{
        return User.findByIdAndUpdate(id,{
            firstname,
            lastname,
            email,
            password,
            role,
            studentclass,
            specialization,
            mylessons,
            favlessons,
            profileImg,
            userstatus
        })}

const deleteUserById = (id)=>{
    return User.findByIdAndDelete(id);}

    const updatePasswordById=(id,password)=>{
        return User.findByIdAndUpdate(id,{ password });
    };
module.exports={User,
    selectAllUsers,
    createNewUser, 
    updateUserById,
    deleteUserById,
    getUserById,
    getUserByEmail,
    updatePasswordById
    };