const mongoose = require("mongoose");



const DemoStudentSchema = new mongoose.Schema({
   
    Name: {
        type: String,
    },
    Number: {
        type: String,
    },
    Email: {
        type: String,
       
    },
    Time: {
        type: String,
      
    },
    Date: {
        type: String,
    },
    day: {
        type: String,
    },
    month: {
        type: String,
    },
    year: {
        type: String,
    },
    Trainer: {
        type: String,
    },
    TrainerId: {
        type: String,
    },
    CounselorId: {
        type: String,
    },
    CounselorName: {
        type: String,
    },
    Course: {
        type: String,
    }, 
    Background: {
        type: String,
    },   
    classLink: {
        type: String,
    }, 
    DemoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewDemo'
    }, 
    status: {
        type: String,
    }   
})
const DemoStudent = new mongoose.model("demoStudents",DemoStudentSchema);

module.exports = DemoStudent;