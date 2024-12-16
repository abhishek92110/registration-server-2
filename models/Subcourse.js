const mongoose = require("mongoose");

const subCourseSchema = new mongoose.Schema({
    mainCourse: {
        type: String,         
    },
    subCourse: {
        type: Object,              
    }, 
})

const batches = new mongoose.model("subCourses", subCourseSchema);

module.exports = batches;