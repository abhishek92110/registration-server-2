const mongoose = require("mongoose");
const {Schema} = mongoose


const Notes = new Schema({
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

    filetype: {
        type: String
    }, 

    Trainer:{
        type: String
    },  

    date:{
        type: Date,
        default: Date.now
    }
})
const uploadnotes = mongoose.model("notes", Notes);

module.exports = uploadnotes;