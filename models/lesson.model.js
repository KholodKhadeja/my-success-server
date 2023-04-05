const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const learningLevelEnum = require("../enum/LearningLevel.Enum");


const LessonSchema = new Schema({
subject:{type:String, required:true},
topic:{type:String, required:true},
learningLevel:{type:String,required:true},
hour: {
    hour: { type: Number, required: true },
    minute: { type: Number, required: true }
  },
date:{ type: Date,required:true, min: new Date().toISOString().slice(0, 10),},
students: [{ type: Schema.Types.ObjectId, ref: "users" }],
teacherId: {type: Schema.Types.ObjectId, ref: "users"},
});

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
const createNewLesson = (subject,topic,learningLevel,hour,date,students,teacherId) => {
    const lesson = new Lesson({subject,topic,learningLevel,hour,date,students,teacherId});
    return lesson.save();
p }

const updateLessonById=(id,subject,topic,learningLevel,hour,date,students)=>{
   return Lesson.findByIdAndUpdate(id,{
    subject,topic,learningLevel,hour,date,students
 })}

const deleteLessonById = (id)=>{
    return Lesson.findByIdAndDelete(id);
}

module.exports={
    Lesson,
    selectAllLessons,
    createNewLesson,
    updateLessonById,
    deleteLessonById,
getLessonById
    };