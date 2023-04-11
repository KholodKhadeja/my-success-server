const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roleEnum = require("../enum/Role.Enum");
const { Lesson } = require("./lesson.model");
// const {Lesson } = require("../models/lesson.model");

const userSchema = new Schema({
    email:{type:String, required:true, unique: true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String,default: roleEnum[0], enum: [...roleEnum]},
    studentclass:{type:String},
    specialization:{type:String},
    mylessons: [{type: Schema.Types.ObjectId,ref: "lessons"}],
    favlessons: [{type: Schema.Types.ObjectId,ref: "lessons"}],
    profileImg: { type: String, match: /^https?:\/\//i},
    userstatus:{type: Boolean, default: true,required:true}
})
userSchema.pre(/^find/,function(next){
    this.populate({path:'mylessons'}).populate({ path: 'favlessons' });
    next()
})

const User= mongoose.model("users", userSchema);

const selectAllUsers = () =>{
    return User.find({});
};

const getUserById = (id)=>{
    return User.findById({_id:id});
}

const getUserByEmail = (email)=>{
    return User.findOne({email}).exec();
}

const createNewUser = (userData) => {
    const user = new User (userData);
    return user.save();
}

const updateUserById=(id, newData)=>{
        return User.findByIdAndUpdate(id, newData,{ new: true } )};

 const updateUserLessonById=async(userId,lesson)=>{
    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { mylessons: lesson._id } }, { new: true });
    return updatedUser;
 }

const updateUserMyLessonById=async (userId,lessonId)=>{
     const updatedUser = await User.findByIdAndUpdate(userId, { $push: { mylessons:lessonId} }, { new: true });
    return updatedUser;
 };


    const updateUserFavLessonById=(id,favlessons)=>{
        return User.findByIdAndUpdate(id,favlessons, { new: true })};

        /*update user lesson - user id */
    const updateUserSpecificLessonByUserId=(userId, lessonId, updatedData)=>{
        const filter = { teacherId:userId, 'mylessons._id': lessonId };
        const update = { $set: { "mylessons.$": updatedData} };
        const options = { new: true };
        User.findOneAndUpdate(filter, update, options)
          .then(updatedUser => {
            console.log('Updated user:', updatedUser);
          })
          .catch(error => {
            console.error('Failed to update user:', error);
          });
        };

const deleteUserById = (id)=>{
    return User.findByIdAndDelete(id);}

    const updatePasswordById=(id,password)=>{
        return User.findByIdAndUpdate(id,{ password });
    };

    const deleteLessonFromMyLesson = async (userId, update)=>{
        return User.findByIdAndUpdate(userId,update, { new: true })
    }
module.exports={User,
    selectAllUsers,
    updateUserLessonById,updateUserMyLessonById,
    createNewUser, 
    updateUserById,
    deleteUserById,
    getUserById,
    getUserByEmail,
    updatePasswordById,
    updateUserSpecificLessonByUserId,
    updateUserFavLessonById,deleteLessonFromMyLesson
    };