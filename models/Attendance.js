const mongoose = require("mongoose");



const AttendanceSchema = new mongoose.Schema({
    date: {
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
    presentId:{
        type: String,
    },
    absentId:{
        type: String,
    },    
    Batch:{
        type: Object,
    },    
    trainerId:{
        type: Object,
    }    
})

const document = new mongoose.model("attendances", AttendanceSchema);

module.exports = document;