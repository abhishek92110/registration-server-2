const mongoose = require("mongoose");

const demoReSchedule = new mongoose.Schema({
    reschedule: {
        type: String,         
    },
    name: {
        type: String,         
    },
    course: {
        type: String,         
    },
    mobile: {
        type: String,         
    },
    status: {
        type: String,         
    },
    scheduleDate: {
        type: String,         
    },    
    counselorNo:{
        type:String,
       },
    Day:{
        type:String,
       },
    month:{
        type:String,
       },
    year:{
        type:String,
       },
       scheduleDate:{
        type:String
       },
       reschedule:{
        type:String
       },
       id:{
        type:String
       },
       students:{
        type:Object
       }

       
})

const RescheduleDemo = new mongoose.model("demoSchedule", demoReSchedule);

module.exports = RescheduleDemo;