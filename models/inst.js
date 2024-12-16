const mongoose = require("mongoose");



const insSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentlists'
    },
   
    emi: {
        type: String,
        required: true,
        unique: true
    },
    inst1: {
        type: Number,
        required: true,
        unique: true
    },
    date1: {
        type: String,
        required: true,
        unique: true
    },
    inst2: {
        type: Number,
        required: true,
        unique: true
    },
    date2: {
        type: String,
        required: true,
        unique: true
    },
    inst3: {
        type: Number,
        required: true,
        unique: true
    },
    date3: {
        type: String,
        required: true,
        unique: true
    },
    inst4: {
        type: Number,
        required: true,
        unique: true
    },
    date4: {
        type: String,
        required: true,
        unique: true
    },
})
const inst = new mongoose.model("ins",insSchema);

module.exports = inst;