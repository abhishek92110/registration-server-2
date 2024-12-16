const mongoose = require("mongoose");

const CounselorDemoSchema = new mongoose.Schema({
  
    
    day: {
        type: String,         
    },
    month: {
        type: String,              
    },
    year: {
        type: String,           
    },
    date: {
        type: String,           
    },
    campaignId:{
        type:String,
       },
       campaignName:{
        type:String,
       },
    demoStudent:{
        type:Object,
    },
    status:{
        type:Object,
    },
    demoStatus:{
        type:Object,
    },
    reschedule:{
        type:Object,
    },
    scheduleDate:{
        type:Object,
    },
    trainer:{
        type:Object,
    },
    trainerId:{
        type:String,
    },
    id:{
        type:String,
       },
    counselorNo:{
     type:String,
    },
    finalStatus:{
        type: String, 
    },
    finalStatusFrom:{
        type: String, 
    },
    finalDate:{
        type: String, 
    },
    remarks:{
        type: String, 
    }
})

const counselorDemo = new mongoose.model("counselordemo", CounselorDemoSchema);

module.exports = counselorDemo;