const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const learningLevelEnum = require("../enum/LearningLevel.Enum");
const {User} = require("../models/user.model");


const LessonSchema = new Schema({
subject:{type:String, required:true},
topic:{type:String, required:true},
learningLevel:{type:String,required:true},
hour:{type: Date,required: true,get: (v) => {return new Date(v).toISOString().slice(11, 16); },
set: (v) => {  const d = new Date(); const [hours, minutes] = v.split(":"); d.setUTCHours(hours, minutes, 0, 0); return d;}},
date:{ type: Date,required:true, min: new Date().toISOString().slice(0, 10),},
students:[{type: Schema.Types.ObjectId,ref: "users"}],
teacherId: {type:String},
zoomLink:{ type: String},
});
LessonSchema.pre(/^find/,function(next){
    this.populate({path:'students'})
    next()
})

const Lesson= mongoose.model("lessons", LessonSchema);

const selectAllLessons = () =>{
   return Lesson.find({});
};
const getLessonById = (id)=>{
    return Lesson.findById({_id:id});
}
const getLessonByteacherId = (id)=>{
    return Lesson.find({teacherId:id});
}
const createNewLesson = (subject,topic,learningLevel,hour,date,students,teacherId, zoomLink) => {
    const lesson = new Lesson({subject,topic,learningLevel,hour,date,students,teacherId,  zoomLink});
    return lesson.save();
 }


const addStudentToStudentArrayOfaLesson=(lessonId, userUpdate)=>{
    return Lesson.findByIdAndUpdate(lessonId,userUpdate, { new: true })
};

const updateLessonById=async (id,subject,topic,learningLevel,hour,date, zoomLink)=>{
 const updatedLesson= await Lesson.findByIdAndUpdate(id,{subject,topic,learningLevel,hour,date, zoomLink})
 return updatedLesson;
}

//  const updateUserSpecificLessonByUserId = async (userId, lessonId, updatedData) => {
//     try {
//       const filter = { _id: userId, "mylessons._id": lessonId };
//       const update = { $set: { "mylessons.$": updatedData } };
//       const options = { new: true };
//       const user = await User.findOne(filter);
//       if (!user) {
//         throw new Error('User not found');
//       }
//       const updatedLesson = user.mylessons.id(lessonId);
//       if (!updatedLesson) {
//         throw new Error('Lesson not found');
//       }
//       Object.assign(updatedLesson, updatedData);
//       await user.save();
//       return updatedLesson;
//     } catch (error) {
//       throw new Error(`Failed to update lesson: ${error.message}`);
//     }
//   };

const deleteLessonById = (id)=>{
    return Lesson.findByIdAndDelete(id);
}

module.exports={
    Lesson,
    selectAllLessons,
    createNewLesson,
    updateLessonById,
    deleteLessonById,
getLessonById,
addStudentToStudentArrayOfaLesson,
// updateUserSpecificLessonByUserId
    };