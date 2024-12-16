const mongoose = require("mongoose");
const {Schema} = mongoose


const SubmitItem = new Schema({

    trainerName:{
        type:String 
    },
    trainerId:{
        type:String 
    },
    assignmentId:{
       type:String
    },
    assignmentUrl:{
       type:String
    },

    student: {
        type: String

    },
    enrollmentNo: {
        type: String

    },
    assignmentFile: {
        type: String

    },
    studentId: {
        type: String

    },
    batch: {
        type: String
       
    },   
    file: {
        type: String
      
    },

    url: {
        type: String
      
    },   
    
    date:{
        type: Date,
        default: Date.now
    }
})
const submititem = mongoose.model("submitdocuments", SubmitItem);

module.exports = submititem;