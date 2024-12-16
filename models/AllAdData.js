const mongoose = require("mongoose");

const addata = new mongoose.Schema({
    id: {
        type: String,         
    },
    name: {
        type: String,         
    },
    status: {
        type: String,         
    },
    created_time: {
        type: String,         
    },
    assigned_counsellor: {
        type: String,         
    },       
    assigned_counsellor_name: {
        type: String,         
    },   
    student: {
        type:Object
    }    
})

const adData = new mongoose.model("addatas", addata);

module.exports = adData;