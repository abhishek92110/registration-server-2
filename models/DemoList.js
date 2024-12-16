const mongoose = require("mongoose");



const NewDemoSchema = new mongoose.Schema({
   
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
    classLink: {
        type: String,
    },  
    status: {
        type: String,
    }   
})
const NewDemo = new mongoose.model("demolists",NewDemoSchema);

module.exports = NewDemo;