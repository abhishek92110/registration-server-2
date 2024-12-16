const mongoose = require("mongoose");
const { Schema } = mongoose


const MessageModel = new Schema({

    message: {
        type: String
    },
    from: {
        type: String
    },
    fromId: {
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
const MessageSchema = mongoose.model("allmessages", MessageModel);

module.exports = MessageSchema;