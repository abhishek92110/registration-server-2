const mongoose = require("mongoose");



const docSchema = new mongoose.Schema({
    otherurl: {
        type: String,

    },
    assigurl: {
        type: String,

    },
    classurl: {
        type: String,

    },
    trainer: {
        type: String,
    },
    course: {
        type: String,
    },
    batch: {
        type: String,
    },
    file: {
        type: String,

    },
    url: {
        type: String,

    },
})

const document = new mongoose.model("links", docSchema);

module.exports = document;