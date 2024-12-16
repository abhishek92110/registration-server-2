const mongoose = require("mongoose");
const {Schema} = mongoose


const UploadVideoUrl = new Schema({
    trainer: {
        type: String 
    },
    batch: {
        type: String 
    }, 
     
    videoUrl: {
        type: String
    }, 

    VideoTitle: {
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
const uploadVideoUrl = mongoose.model("uploadvideourls", UploadVideoUrl);

module.exports = uploadVideoUrl;