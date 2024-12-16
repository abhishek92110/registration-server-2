const mongoose = require("mongoose");



const StudentAttendanceSchema = new mongoose.Schema({
    day: {
        type: String,         
    },
    month: {
        type: String,              
    },
    year: {
        type: String,           
    },
    fullDate: {
        type: String,           
    },
    studentId:{
        type: Object,
    },   
    Batch:{
        type: String,
    },    
    trainerId:{
        type: String,
    },    
    BatchDay:{
        type: String,
    },    
    attendanceStatus:{
        type: String,
    }   
})

const document = new mongoose.model("studentattendances", StudentAttendanceSchema);

module.exports = document;