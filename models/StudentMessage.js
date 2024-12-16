const mongoose = require("mongoose");
const { Schema } = mongoose


const StudentMessageModel = new Schema({

    message: {
        type: String
    },
    from: {
        type: String
    },
    batch:{
        type: String
    },
    EnrollmentNo:{
        type: String
    },
    messageid: {
      type:String
    },
    date: {
        type: Date,
        default: Date.now
    },
    file:{
        type:String
    }

})
const StudentMessageSchema = mongoose.model("studentmessages", StudentMessageModel);

module.exports = StudentMessageSchema;