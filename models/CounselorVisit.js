const mongoose = require("mongoose");

const CounselorDemoSchema = new mongoose.Schema({
  
    counselorNo:{
        type:String,
       }, 
    name:{
        type:String,
       }, 
    Course:{
        type:String,
       }, 
    mobile:{
        type:String,
       },    
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
    visitDate: {
        type: String,           
    },  
    visitTrainer:{
        type:String,
       },
       trainerId:{
        type:String,
    },
    visitCounsellor:{
        type:String,
       },
    visitStatus:{
        type:String,
       },
    visitResponse:{
        type:String,
       },
       campaignId:{
        type:String,
       },
       campaignName:{
        type:String,
       },
       id:{
        type:String
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

const counselorDemo = new mongoose.model("counselorvisit", CounselorDemoSchema);

module.exports = counselorDemo;