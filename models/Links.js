const mongoose = require("mongoose");
const {Schema} = mongoose


const AssignmentLinks = new Schema({
    file:{
       type:String
    },
    trainer: {
        type: String 
    },
    batch: {
        type: String 
    },  
    url: {
        type: String
    },  
    Trainer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'uploads'
    },     
    date:{
        type: Date,
        default: Date.now
    }
})
const assignment = mongoose.model("assignmentlinks", AssignmentLinks);

module.exports = assignment;