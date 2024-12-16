const mongoose = require("mongoose");
const {Schema} = mongoose


const UploadClassUrl = new Schema({
    trainerName: {
        type: String 
    },
    batch: {
        type: String 
    },  
    classUrl: {
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
const uploadClassUrl = mongoose.model("uploadclassurls", UploadClassUrl);

module.exports = uploadClassUrl;