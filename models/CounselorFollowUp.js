const mongoose = require("mongoose");

const CounselorFollowUp = new mongoose.Schema({
  
    Course: {
        type: String,         
    },   
    day: {
        type: String,         
    },
    month: {
        type: String,              
    },
    remark: {
        type: String,              
    },
    status: {
        type: String,              
    },
    year: {
        type: String,           
    },
    date: {
        type: String,           
    },
    name: {
        type: String,           
    },
    mobile: {
        type: String,           
    },
    counselorNo:{
     type:String,
    },
    lastFollowUpDate:{
     type:String,
    }, 
    FollowUp:{
     type:Object,
    }, 
    campaignId:{
        type:String,
       },
       campaignName:{
        type:String,
       },
    id:{
     type:Object,
    }, 
    students:{
     type:Object,
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

const counselorFollowUp = new mongoose.model("counselorfollowup", CounselorFollowUp);

module.exports = counselorFollowUp;