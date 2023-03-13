const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const learningLevelEnum = require("../enum/LearningLevel.Enum");

const LessonSchema = new Schema({
subject:{type:String, required:true},
topic:{type:String, required:true},
learningLevel:{type:String,required:true,default: learningLevelEnum[0], enum: [...learningLevelEnum]},
teacherId:{type: Schema.Types.ObjectId, ref: "users", required:true},
hour:{ type: Date,required: true,get: (v) => {return new Date(v).toISOString().slice(11, 16); },
set: (v) => { return new Date(`1970-01-01T${v}:00.000Z`); },},
date:{ type: Date,default: Date.now, required:true},
students: [{
    type: Schema.Types.ObjectId,
    ref: "users"
  }]
})

const Lesson= mongoose.model("lessons", LessonSchema);

const selectAllLessons = () =>{
    return Lesson.find({});
};
const getLessonById = (id)=>{
    return Lesson.findById(id);
}
const getLessonByteacherId = (id)=>{
    return Lesson.find({teacherId:id});
}
const createNewLesson = (lessonData) => {
    const lesson = new Lesson (lessonData);
    return lesson.save();
}

const updateLessonById=(id,subject,topic,learningLevel,teacherId,hour,date,students)=>{
   return Lesson.findByIdAndUpdate(id,{
    subject,topic,learningLevel,teacherId,hour,date,students
 })}

const deleteLessonById = (id)=>{
    return Lesson.findByIdAndDelete(id);}

module.exports={selectAllLessons,
    createNewLesson,
    updateLessonById,
    deleteLessonById,
    showLessonById
    };