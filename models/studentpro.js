const mongoose = require("mongoose");




const proSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentlists'
    },
    rollno: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    parentname: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    academicmonth: {
        type: String,
        required: true,
        unique: true
    },
    trainer: {
        type: String,
        required: true,
        unique: true
    },   
    batchtime: {
        type: String,
        required: true,
        unique: true
    }
})
const profile = new mongoose.model("studentprofile", proSchema);

module.exports = profile;