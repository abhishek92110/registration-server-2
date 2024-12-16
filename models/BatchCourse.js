const mongoose = require("mongoose");

const BatchesSchema = new mongoose.Schema({
    Course: {
        type: Object,         
    },
    WeekDaysBatch: {
        type: Object,              
    },
    WeekEndBatch: {
        type: Object,           
    }   
})

const bathces = new mongoose.model("Batches", BatchesSchema);

module.exports = bathces;