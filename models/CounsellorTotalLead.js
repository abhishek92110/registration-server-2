const mongoose = require("mongoose");

const CounsellorTotalLead = new mongoose.Schema({
    date: {
        type: String,         
    }, 

    adId: {
        type: String,         
    },
    
    adName:{
        type: String,  
    },

    // counselorNo:{
    //     type:String,
    //    },
    student:{
        type:Object,
       }
       
})

const CounsellorTotalLeadSchema = new mongoose.model("counsellortotalleads", CounsellorTotalLead);

module.exports = CounsellorTotalLeadSchema;