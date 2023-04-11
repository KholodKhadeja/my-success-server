const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const learningLevelEnum = require("../enum/LearningLevel.Enum");
const {User} = require("./user.model");

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
const createNewLesson = (lessonData) => {
    const lesson = new Lesson(lessonData);
    return lesson.save();
 }

const addStudentToStudentArrayOfaLesson=(lessonId, userUpdate)=>{
    return Lesson.findByIdAndUpdate(lessonId,userUpdate, { new: true })
};

const addStuToStudentsArray=async (lessonId, studentId)=>{
    const updateLesson= await Lesson.findByIdAndUpdate(lessonId, studentId, { new: true });
   return updateLesson;
}
   
const updateLessonById=async (id,subject,topic,learningLevel,hour,date, zoomLink)=>{
 const updatedLesson= await Lesson.findByIdAndUpdate(id,{subject,topic,learningLevel,hour,date, zoomLink})
 return updatedLesson;
}

const deleteLessonById = async(lessonId, userId)=>{
    const deletedLesson= await Lesson.findByIdAndDelete(lessonId);
   return deletedLesson;
}


module.exports={
    Lesson,LessonSchema,addStuToStudentsArray,
    selectAllLessons,
    createNewLesson,
    updateLessonById,
    deleteLessonById,
getLessonById,
addStudentToStudentArrayOfaLesson,
// updateUserSpecificLessonByUserId
    };